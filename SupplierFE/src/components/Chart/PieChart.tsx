import type { ChartData } from 'chart.js'
import { Pie } from 'react-chartjs-2'
type PieChartJSProps = {
  data: ChartData<'pie', number[], string>
}

function PieChartJS({ data }: PieChartJSProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
    },
  }

  return <Pie key={JSON.stringify(data)} data={data} options={options} />
}

export default PieChartJS
