import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { format, subDays, eachDayOfInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// --- Custom Hook para procesar datos ---
const useCashFlowStats = (transactions = [], days = 7) => {
  const stats = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { dailyBalance: [], incomeByCategory: [], expenseByCategory: [] };
    }

    // Normaliza los datos de entrada
    const normalizedTransactions = transactions.map(t => ({
      ...t,
      type: String(t.type).toLowerCase(),
      // Validación robusta de fecha:
      date: t.date ? format(parseISO(t.date), 'yyyy-MM-dd') : '',
      amount: parseFloat(t.amount) || 0
    }));

    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);
    const dateInterval = eachDayOfInterval({ start: startDate, end: endDate });

    // 1. Balance diario (Ingresos vs Egresos)
    const dailyBalance = dateInterval.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayTransactions = normalizedTransactions.filter(t => t.date === dayStr);
      
      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        date: format(day, 'dd/MM'),
        dayName: format(day, 'eee', { locale: es }),
        income,
        expense,
      };
    });

    // 2. Totales por categoría
    const categoryReducer = (acc, t) => {
      const category = t.category || 'Sin categoría';
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    };

    const incomeByCategoryRaw = normalizedTransactions
      .filter(t => t.type === 'income')
      .reduce(categoryReducer, {});
      
    const expenseByCategoryRaw = normalizedTransactions
      .filter(t => t.type === 'expense')
      .reduce(categoryReducer, {});

    const toChartData = (data) => Object.entries(data).map(([name, value]) => ({ name, value }));

    return {
      dailyBalance,
      incomeByCategory: toChartData(incomeByCategoryRaw),
      expenseByCategory: toChartData(expenseByCategoryRaw),
    };
  }, [transactions, days]);

  return stats;
};


// --- Componentes de Gráficos ---

const COLORS = {
  income: '#10B981', // Emerald
  expense: '#EF4444', // Red
  pie: ['#14B8A6', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'],
};

const DailyBalanceChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <DollarSign className="mr-2 h-5 w-5 text-slate-500" />
        Balance de los Últimos 7 Días
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.2)" />
          <XAxis dataKey="dayName" tick={{ fill: '#64748b' }} />
          <YAxis tick={{ fill: '#64748b' }} tickFormatter={(value) => `$${(value/1000)}k`} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              borderRadius: '0.75rem'
            }}
            cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
          />
          <Legend />
          <Bar dataKey="income" fill={COLORS.income} name="Ingresos" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill={COLORS.expense} name="Egresos" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const CategoryPieChart = ({ data, title, icon }) => {
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#94a3b8" fontSize={14}>{`${payload.name}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#e2e8f0" fontSize={12}>
          {`$${value.toLocaleString('es-AR')} (${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  
  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = (_, index) => setActiveIndex(index);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
            <p className="text-slate-500">No hay datos para mostrar.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS.pie[index % COLORS.pie.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};


// --- Componente Principal ---
const CashFlowCharts = ({ transactions }) => {
  const { dailyBalance, incomeByCategory, expenseByCategory } = useCashFlowStats(transactions, 7);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="lg:col-span-2">
        <DailyBalanceChart data={dailyBalance} />
      </div>
      
      <CategoryPieChart 
        data={incomeByCategory} 
        title="Ingresos por Categoría"
        icon={<TrendingUp className="mr-2 h-5 w-5 text-emerald-500" />}
      />
      
      <CategoryPieChart 
        data={expenseByCategory} 
        title="Egresos por Categoría"
        icon={<TrendingDown className="mr-2 h-5 w-5 text-red-500" />}
      />
    </div>
  );
};

export default CashFlowCharts;
