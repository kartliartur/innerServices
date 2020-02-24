<template>
  <div class="dashboard">
    <MyHeader/>
    <div class="charts-cont">
      <div class="chart-wrapper" v-for="(chart, idx) in chartsObj" :key="idx">
        <h2>{{ chart.title }}</h2>
        <div class="filter-wrap">
          <input type="date" name="first_date" v-model="chart.firstDate">
          <input type="date" name="last_date" v-model="chart.lastDate">
          <select v-model="chart.actualMark">
            <optgroup v-for="(item, indx) in marks" :key="indx"
                      :label="item.Product_Type">
              <option v-for="(mark, index) in item.Products" :key="index"
                      :value="mark.Рroduct_Code">
                {{ mark.Product_Name }}
              </option>
            </optgroup>
          </select>
          <select v-if="chart.secondSelect" 
                  v-model="activeCountry" 
                  @change="reDraw(chart)">
            <option v-for="(country, cIdx) in countrys" :key="cIdx"
                    :value="cIdx">
              {{ country.Country }}
            </option>
          </select>
          <button @click="getChart(chart.path, chart)">Получить</button>
        </div>
        <ChartBlock
                  v-if="chart.isShow"
                  :type="chart.type"
                  chartName="bar_graf"
                  :label="chart.label"
                  :dataSet="chart.data"
                  :name="chart.path"
                  :colors="colors"
                  :labels="chart.labels"/>
      </div>      
    </div>
    <div class="tables-cont">
      <div class="chart-wrapper" v-for="(table, tIdx) in tables" :key="tIdx">
        <h2>{{ table.title }}</h2>
        <div class="filter-wrap">
          <input type="date" name="first_date" v-model="table.firstDate">
          <input type="date" name="last_date" 
                v-model="table.lastDate"
                v-if="table.isNotWare">
          <select v-model="table.actualMark">
            <optgroup v-for="(item, sindx) in marks" :key="sindx"
                      :label="item.Product_Type">
              <option v-for="(mark, sindex) in item.Products" :key="sindex"
                      :value="mark.Рroduct_Code">
                {{ mark.Product_Name }}
              </option>
            </optgroup>
          </select>
          <button @click="getChart(table.path, table)">Получить</button>
        </div>
        <myTable
              v-if="table.isShow"
              :heads="table.heads"
              :content="table.content"/>        
      </div>        
    </div>
    <myNotification
        :text="not_text"
        :textColor="not_color"
        v-show="is_not_show"/>
  </div>
</template>

<script>
// @ is an alias to /src
import MyHeader from '@/components/other/myHeader.vue'
import ChartBlock from '@/components/dashboard/chart-block.vue'
import Funcs from '../assets/js-funcs/default-funcs.js'
import myNotification from '@/components/other/notification.vue'
import myTable from '@/components/other/table.vue'

export default {
  name: 'dashBoard',
  components: {
    ChartBlock,
    MyHeader, 
    myNotification,
    myTable
  },
  data: () => {
    return {
      not_text: '',
      not_color: 'red',
      is_not_show: false,
      colors: [
        'rgba(26, 188, 156,1.0)',
        'rgba(241, 196, 15,1.0)',
        'rgba(46, 204, 113,1.0)',
        'rgba(230, 126, 34,1.0)',
        'rgba(52, 152, 219,1.0)',
        'rgba(231, 76, 60,1.0)',
        'rgba(155, 89, 182,1.0)',
        'rgba(236, 240, 241,1.0)',
        'rgba(52, 73, 94,1.0)',
        'rgba(149, 165, 166,1.0)',
        'rgba(22, 160, 133,1.0)',
        'rgba(243, 156, 18,1.0)',
        'rgba(39, 174, 96,1.0)',
        'rgba(211, 84, 0,1.0)',
        'rgba(41, 128, 185,1.0)',
        'rgba(192, 57, 43,1.0)',
        'rgba(142, 68, 173,1.0)',
        'rgba(189, 195, 199,1.0)',
        'rgba(44, 62, 80,1.0)',
        'rgba(255, 234, 167,1.0)',
        'rgba(85, 239, 196,1.0)',
        'rgba(250, 177, 160,1.0)',
        'rgba(129, 236, 236,1.0)',
        'rgba(255, 118, 117,1.0)',
        'rgba(162, 155, 254,1.0)',
        'rgba(232, 67, 147,1.0)',
        'rgba(196, 229, 56,1.0)',
        'rgba(111, 30, 81,1.0)',
        'rgba(153, 128, 250,1.0)'
      ],
      marks: [],
      countrys: [],
      activeCountry: 0,
      chartsObj: [
        {
          labels: [],
          label: 'Продажи за месяц',
          data: [],
          title: 'Продажи за месяц',
          isShow: false,
          actualMark: new String(),
          firstDate: '2018-01-17',
          lastDate: '2019-01-17',
          type: 'line',
          path: 'sales-by-month',
          secondSelect: false     
        },
        {
          labels: [],
          label: 'Продажи',
          data: [],
          title: 'Продажи менеджеров',
          actualMark: new String(),
          firstDate: '2018-01-17',
          lastDate: '2019-01-17',
          isShow: false,
          type: 'pie',
          path: 'sales-by-manager',
          secondSelect: false             
        },
        {
          labels: [],
          label: 'Продажи',
          data: [],
          title: 'Продажи клиентов',
          actualMark: new String(),
          firstDate: '2018-01-17',
          lastDate: '2019-01-17',
          isShow: false,
          type: 'pie',
          path: 'sales-by-clients',
          secondSelect: false             
        }
      ],
      tables: [
        {
          title: 'Баланс организаций',
          isShow: false,
          actualMark: new String(''),
          firstDate: '2018-01-17',
          lastDate: '2019-01-17',
          path: 'balance-by-organization',
          heads: ['Организация', 'Начальный остаток', 'Приход', 'Расход', 'Конечный остаток'],
          content: [],
          isNotWare: true
        },
        {
          title: 'Цена по скаладам',
          isShow: false,
          actualMark: new String(''),
          firstDate: '2019-01-17',
          path: 'cost-by-warehouse',
          heads: ['Организация', 'Начальный остаток', 'Приход', 'Расход', 'Конечный остаток'],
          content: [],
          isNotWare: false
        },
        {
          title: 'Экономика',
          isShow: false,
          actualMark: new String(''),
          firstDate: '2018-01-17',
          lastDate: '2019-01-17',
          path: 'economy',
          heads: ['Организация', 'Начальный остаток', 'Приход', 'Расход', 'Конечный остаток'],
          content: [],
          isNotWare: true          
        }
      ]
    }
  },
  methods: {
    showNotification(text, color) {
      this.not_text = text;
      this.not_color = color;
      this.is_not_show = true;
      setTimeout(() => {
        this.is_not_show = false;
      }, 2500);
    },
    getChart(path, chart) {
      chart.isShow = false;
      chart.labels = [];
      chart.data = [];
      Funcs.doRequest(
        'post',
        'https://erp.unlogic.ru/erp_base/hs/products/get/' + path,
        {
          date_first: chart.firstDate,
          date_last: chart.lastDate,
          product_code: chart.actualMark
        },
        null,
        res => {
          if (!res.data.error) {
            if (res.data.data.length > 0) {
              switch (path) {
                case 'manager_sales':
                  this.managersSuccess(res, chart);
                  break;
                case 'month_sales':
                  this.monthSalesSuccess(res, chart);
                  break;
                case 'client_sales':
                  this.clientSalesSuccess(res, chart, 0);
                  break;
                case 'organization_balance':
                  this.organizationSuccess(res, chart);
                  break;
                default:
                  // statements_def
                  break;
              }              
            } else {
              this.showNotification('Набор данных пуст', 'red');
            }
          } else {
            this.showNotification(res.data.data, 'red');
          }
        },
        () => { window.console.log('ERR'); }
      );
    },
    organizationSuccess(res, table) {
      table.isShow = false;
      table.content = [];
      let allStart = 0,
          allInflow = 0,
          allOutFlow = 0,
          allFinish = 0;
      for (let i in res.data.data) {
        let start = 0,
            finish = 0,
            inflow = 0,
            outflow = 0;
        for (let j in res.data.data[i].Warehouses) {
          start += res.data.data[i].Warehouses[j].Start_balance;
          finish += res.data.data[i].Warehouses[j].Final_balance;
          inflow += res.data.data[i].Warehouses[j].Inflow_count;
          outflow += res.data.data[i].Warehouses[j].Outflow_count;
        }
        table.content.push([{
                              text: res.data.data[i].Organization,
                              isTitle: true
                            }
                            ,start
                            ,inflow
                            ,outflow
                            ,finish]);
        allStart += start;
        allInflow += inflow;
        allOutFlow += outflow;
        allFinish += finish;
        for (let j in res.data.data[i].Warehouses) {
          table.content.push([res.data.data[i].Warehouses[j].Warehouse
                                      ,res.data.data[i].Warehouses[j].Start_balance
                                      ,res.data.data[i].Warehouses[j].Inflow_count
                                      ,res.data.data[i].Warehouses[j].Outflow_count
                                      ,res.data.data[i].Warehouses[j].Final_balance]);
        }
      }
      table.content.push(['Итого', allStart, allInflow, allOutFlow, allFinish]);
      table.isShow = true;
    },
    clientSalesSuccess(res, chart, activeIndex) {
      this.countrys = [];
      this.activeCountry = 0;
      for (let i in res.data.data) {
        this.countrys.push(res.data.data[i]);
      }
      for (let j in res.data.data[activeIndex].Sold_by_clients) {
        chart.labels.push(res.data.data[activeIndex].Sold_by_clients[j].Client);
        chart.data.push(res.data.data[activeIndex].Sold_by_clients[j].Total_sold);        
      }
      chart.secondSelect = true;
      chart.isShow = true;  
    },
    reDraw(chart) {
      chart.isShow = false;
      chart.labels = [];
      chart.data = [];
      setTimeout(() => {
        for (let j in this.countrys[this.activeCountry].Sold_by_clients) {
          chart.labels.push(this.countrys[this.activeCountry].Sold_by_clients[j].Client);
          chart.data.push(this.countrys[this.activeCountry].Sold_by_clients[j].Total_sold);        
        }
        chart.isShow = true;  
      })
    },
    managersSuccess(res, chart) {
      for (let i in res.data.data[0].Managers) {
        chart.labels.push(res.data.data[0].Managers[i].Manager);
        chart.data.push(res.data.data[0].Managers[i].Total_sold);
      }
      chart.isShow = true;                   
    },
    monthSalesSuccess(res, chart) {
      for (let i in res.data.data) {
        let month = new Date(res.data.data[i].Month).getMonth();
        let year = new Date(res.data.data[i].Month).getFullYear();
        let dict = [
          'Январь',
          'Февраль',
          'Март',
          'Апрель',
          'Май',
          'Июнь',
          'Июль',
          'Август',
          'Сентябрь',
          'Октябрь',
          'Ноябрь',
          'Декабрь'
        ];
        chart.labels.push(dict[month] + ' ' + year); 
        chart.data.push(res.data.data[i].Total_sold);
      }
      chart.isShow = true;                   
    }
  },
  beforeMount() {
    Funcs.doRequest(
      'get',
      'https://erp.unlogic.ru/erp_base/hs/products/get/full-list',
      null,
      null,
      res => {
        this.marks = res.data.data;
      },
      () => { window.console.log('ERR'); }
    );
  }
}
</script>

<style lang="less">
	@import url('../assets/less-templates/base.less');
	.dashboard {
		.flex(column, flex-start, flex-start);
		width: 100%;
		min-height: 100vh;
    height: auto;

    & .charts-cont, .tables-cont {
      .flex(row, space-around, center);
      width: 100%;
      flex-wrap: wrap;
    }

    & .chart-wrapper {
      .flex(column, flex-start, center);
      background: #cecece00;
      box-shadow: 2px 2px 14px 2px rgba(0,0,0,.3);
      border-radius: 5px;
      width: 95%;
      min-width: 320px;
      padding: 10px;
      margin: 10px 0;

      & h2 {
        padding: 10px 0;
        border-bottom: 1px solid #000;
        font-size: 1.2em;
      }
    }
    
    & .charts-cont {
      & .chart-wrapper:nth-child(2), .chart-wrapper:nth-child(3) {
        width: 45%;
      }        
    }

    & .filter-wrap {
      .flex(row, space-around, center);
      width: 100%;
      max-width: 500px;
      flex-wrap: wrap;
      padding: 20px 0;

      & input, select {
        .input();
        margin: 5px 0;
        max-width: 100%;
      }

      & button {
        .button(5px, @green-color, #fff);
      }
    }
	}
</style>
