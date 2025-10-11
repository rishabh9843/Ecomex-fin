import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading: salesLoading, error: salesError } = useGetTotalSalesQuery();
  const { data: customers, isLoading: customersLoading, error: customersError } = useGetUsersQuery();
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetTotalOrdersQuery();
  const { data: salesDetail, isLoading: salesDetailLoading, error: salesDetailError } = useGetTotalSalesByDateQuery();

  const [lineChartState, setLineChartState] = useState({
    options: {
      chart: {
        type: "line",
        background: "#1a1a1a",
        toolbar: { show: true },
      },
      tooltip: { theme: "dark", enabled: true },
      colors: ["#00E396"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      title: {
        text: "Sales Trend - Line Chart",
        align: "left",
        style: { color: "#fff", fontSize: "16px" },
      },
      grid: { borderColor: "#333", strokeDashArray: 3, show: true },
      markers: {
        size: 4,
        colors: ["#00E396"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: { size: 7 },
      },
      xaxis: {
        categories: [],
        title: { text: "Date", style: { color: "#fff" } },
        labels: {
          style: { colors: "#fff", fontSize: "12px" },
          formatter: function(value) {
            return value ? value.substring(0, 10) : '';
          }
        },
        axisBorder: { color: "#333" },
        axisTicks: { color: "#333" },
      },
      yaxis: {
        title: { text: "Sales ($)", style: { color: "#fff" } },
        labels: { style: { colors: "#fff", fontSize: "12px" } },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
        labels: { colors: "#fff" },
      },
      theme: { mode: "dark" },
      responsive: [{ breakpoint: 1024, options: { chart: { width: "100%" } } }],
    },
    series: [{ name: "Sales", data: [] }],
  });

  const [barChartState, setBarChartState] = useState({
    options: {
      chart: {
        type: "bar",
        background: "#1a1a1a",
        toolbar: { show: true },
      },
      tooltip: { theme: "dark", enabled: true },
      colors: ["#FF6B6B"],
      dataLabels: { enabled: false },
      title: {
        text: "Sales by Date - Bar Chart",
        align: "left",
        style: { color: "#fff", fontSize: "16px" },
      },
      grid: { borderColor: "#333", show: true },
      xaxis: {
        categories: [],
        title: { text: "Date", style: { color: "#fff" } },
        labels: {
          style: { colors: "#fff", fontSize: "12px" },
          formatter: function(value) {
            return value ? value.substring(0, 10) : '';
          }
        },
        axisBorder: { color: "#333" },
        axisTicks: { color: "#333" },
      },
      yaxis: {
        title: { text: "Sales ($)", style: { color: "#fff" } },
        labels: { style: { colors: "#fff", fontSize: "12px" } },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: { colors: "#fff" },
      },
      theme: { mode: "dark" },
      responsive: [{ breakpoint: 1024, options: { chart: { width: "100%" } } }],
    },
    series: [{ name: "Sales", data: [] }],
  });

  const [areaChartState, setAreaChartState] = useState({
    options: {
      chart: {
        type: "area",
        background: "#1a1a1a",
        toolbar: { show: true },
      },
      tooltip: { theme: "dark", enabled: true },
      colors: ["#4ECDC4"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 } },
      title: {
        text: "Sales Trend - Area Chart",
        align: "left",
        style: { color: "#fff", fontSize: "16px" },
      },
      grid: { borderColor: "#333", strokeDashArray: 3, show: true },
      xaxis: {
        categories: [],
        title: { text: "Date", style: { color: "#fff" } },
        labels: {
          style: { colors: "#fff", fontSize: "12px" },
          formatter: function(value) {
            return value ? value.substring(0, 10) : '';
          }
        },
        axisBorder: { color: "#333" },
        axisTicks: { color: "#333" },
      },
      yaxis: {
        title: { text: "Sales ($)", style: { color: "#fff" } },
        labels: { style: { colors: "#fff", fontSize: "12px" } },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: { colors: "#fff" },
      },
      theme: { mode: "dark" },
      responsive: [{ breakpoint: 1024, options: { chart: { width: "100%" } } }],
    },
    series: [{ name: "Sales", data: [] }],
  });

  const [pieChartState, setPieChartState] = useState({
    options: {
      chart: {
        type: "pie",
        background: "#1a1a1a",
        toolbar: { show: true },
      },
      colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"],
      dataLabels: { enabled: true, style: { colors: ["#fff"] } },
      legend: {
        position: "bottom",
        labels: { colors: "#fff" },
      },
      tooltip: { theme: "dark" },
      title: {
        text: "Sales Distribution by Date",
        align: "left",
        style: { color: "#fff", fontSize: "16px" },
      },
      theme: { mode: "dark" },
      responsive: [{ breakpoint: 1024, options: { chart: { width: "100%" } } }],
    },
    series: [],
    labels: [],
  });

  useEffect(() => {
    if (salesDetail && Array.isArray(salesDetail) && salesDetail.length > 0) {
      try {
        const formattedSalesDate = salesDetail
          .filter((item) => item && item._id && item.totalSales !== undefined)
          .map((item) => ({
            x: String(item._id),
            y: parseFloat(item.totalSales) || 0,
          }))
          .sort((a, b) => a.x.localeCompare(b.x));

        if (formattedSalesDate.length > 0) {
          const dates = formattedSalesDate.map((item) => item.x);
          const salesData = formattedSalesDate.map((item) => item.y);

          // Line Chart
          setLineChartState((prevState) => ({
            ...prevState,
            options: {
              ...prevState.options,
              xaxis: {
                ...prevState.options.xaxis,
                categories: dates,
              },
            },
            series: [
              {
                name: "Sales",
                data: salesData,
              },
            ],
          }));

          // Bar Chart
          setBarChartState((prevState) => ({
            ...prevState,
            options: {
              ...prevState.options,
              xaxis: {
                ...prevState.options.xaxis,
                categories: dates,
              },
            },
            series: [
              {
                name: "Sales",
                data: salesData,
              },
            ],
          }));

          // Area Chart
          setAreaChartState((prevState) => ({
            ...prevState,
            options: {
              ...prevState.options,
              xaxis: {
                ...prevState.options.xaxis,
                categories: dates,
              },
            },
            series: [
              {
                name: "Sales",
                data: salesData,
              },
            ],
          }));

          // Pie Chart
          setPieChartState((prevState) => ({
            ...prevState,
            series: salesData,
            labels: dates,
          }));
        }
      } catch (error) {
        console.error("Error formatting sales data:", error);
      }
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem] bg-gray-950 min-h-screen p-4">
        {/* Metric Cards */}
        <div className="w-full flex justify-around flex-wrap mb-8">
          {/* Sales Card */}
          <div className="rounded-lg bg-gray-900 p-5 w-[20rem] mt-5 border border-gray-700 hover:border-pink-500 transition shadow-lg">
            <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-pink-500 text-center p-3 text-white flex items-center justify-center text-lg">
              $
            </div>
            <p className="mt-5 text-gray-400 text-sm">Sales</p>
            {salesError && <p className="text-red-500 text-xs mt-2">Error: {salesError?.data?.message || "Failed to load"}</p>}
            <h1 className="text-xl font-bold text-white mt-2">
              {salesLoading ? (
                <span className="text-sm">Loading...</span>
              ) : sales?.totalSales ? (
                `$ ${Number(sales.totalSales).toFixed(2)}`
              ) : (
                "$ 0.00"
              )}
            </h1>
          </div>

          {/* Customers Card */}
          <div className="rounded-lg bg-gray-900 p-5 w-[20rem] mt-5 border border-gray-700 hover:border-blue-500 transition shadow-lg">
            <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-blue-500 text-center p-3 text-white flex items-center justify-center text-lg">
              👥
            </div>
            <p className="mt-5 text-gray-400 text-sm">Customers</p>
            {customersError && <p className="text-red-500 text-xs mt-2">Error: {customersError?.data?.message || "Failed to load"}</p>}
            <h1 className="text-xl font-bold text-white mt-2">
              {customersLoading ? (
                <span className="text-sm">Loading...</span>
              ) : customers && Array.isArray(customers) ? (
                customers.length
              ) : (
                "0"
              )}
            </h1>
          </div>

          {/* Orders Card */}
          <div className="rounded-lg bg-gray-900 p-5 w-[20rem] mt-5 border border-gray-700 hover:border-green-500 transition shadow-lg">
            <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-green-500 text-center p-3 text-white flex items-center justify-center text-lg">
              📦
            </div>
            <p className="mt-5 text-gray-400 text-sm">All Orders</p>
            {ordersError && <p className="text-red-500 text-xs mt-2">Error: {ordersError?.data?.message || "Failed to load"}</p>}
            <h1 className="text-xl font-bold text-white mt-2">
              {ordersLoading ? (
                <span className="text-sm">Loading...</span>
              ) : orders?.totalOrders ? (
                orders.totalOrders
              ) : (
                "0"
              )}
            </h1>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Line Chart */}
          <div className="rounded-lg bg-gray-900 p-5 border border-gray-700">
            {salesDetailLoading ? (
              <div className="w-full h-[400px] flex items-center justify-center">
                <Loader />
              </div>
            ) : salesDetailError ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-red-400 text-lg">Error loading chart</p>
                <p className="text-gray-400 text-xs mt-2">{salesDetailError?.message}</p>
              </div>
            ) : lineChartState.series?.[0]?.data?.length > 0 ? (
              <Chart
                options={lineChartState.options}
                series={lineChartState.series}
                type="line"
                width="100%"
                height={400}
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-400">
                <p>No data available</p>
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="rounded-lg bg-gray-900 p-5 border border-gray-700">
            {salesDetailLoading ? (
              <div className="w-full h-[400px] flex items-center justify-center">
                <Loader />
              </div>
            ) : salesDetailError ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-red-400 text-lg">Error loading chart</p>
              </div>
            ) : barChartState.series?.[0]?.data?.length > 0 ? (
              <Chart
                options={barChartState.options}
                series={barChartState.series}
                type="bar"
                width="100%"
                height={400}
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-400">
                <p>No data available</p>
              </div>
            )}
          </div>

          {/* Area Chart */}
          <div className="rounded-lg bg-gray-900 p-5 border border-gray-700">
            {salesDetailLoading ? (
              <div className="w-full h-[400px] flex items-center justify-center">
                <Loader />
              </div>
            ) : salesDetailError ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-red-400 text-lg">Error loading chart</p>
              </div>
            ) : areaChartState.series?.[0]?.data?.length > 0 ? (
              <Chart
                options={areaChartState.options}
                series={areaChartState.series}
                type="area"
                width="100%"
                height={400}
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-400">
                <p>No data available</p>
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="rounded-lg bg-gray-900 p-5 border border-gray-700">
            {salesDetailLoading ? (
              <div className="w-full h-[400px] flex items-center justify-center">
                <Loader />
              </div>
            ) : salesDetailError ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-red-400 text-lg">Error loading chart</p>
              </div>
            ) : pieChartState.series?.length > 0 ? (
              <Chart
                options={pieChartState.options}
                series={pieChartState.series}
                labels={pieChartState.labels}
                type="pie"
                width="100%"
                height={400}
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-400">
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Orders List Section */}
        <div className="mt-8">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;