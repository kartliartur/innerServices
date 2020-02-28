<template>
  <div class="sellers">
    <MyHeader/>
   <h2 v-if="this.$store.state.sales.length === 0">Список пуст</h2>
    <div class="content" >
      <div v-if="customerApproval.length > 0" class="toggle-wrap" @click="openTaskList('customer')">
        <h2>Согласование заказа клиента</h2>
        <span :class="{ 'active-span': customerIsShow }">></span>
      </div>
      <div class="sales-wrap" :class="{ 'sales-active': customerIsShow }">
        <Sale v-for="(item, idx) in customerApproval" :key="idx"
              :day="new Date(item.Deadline).getDate()"
              :month="new Date(item.Deadline).getMonth()"
              :company="item.Partner"
              :inn="item.INN"
              :saleIndex="item.lostIndex"
              :taskType="item.TaskType"
              @toggleModal="isModalOpen=true"/>
      </div>
      <div v-if="supplierApproval.length > 0" class="toggle-wrap" @click="openTaskList('supplier')">
        <h2>Согласование заказа поставщику</h2>
        <span :class="{ 'active-span': supplierIsShow }">></span>
      </div>
      <div class="sales-wrap" :class="{ 'sales-active': supplierIsShow }">
        <Sale v-for="(item, idx) in supplierApproval" :key="idx"
              :day="new Date(item.Deadline).getDate()"
              :month="new Date(item.Deadline).getMonth()"
              :company="item.Partner"
              :inn="item.INN"
              :saleIndex="item.lostIndex"
              :taskType="item.TaskType"
              @toggleModal="isModalOpen=true"/>
      </div>
      <div v-if="salesConditions.length > 0" class="toggle-wrap" @click="openTaskList('sales')">
        <h2>Изменение условий продаж:</h2>
        <span :class="{ 'active-span': salesIsShow }">></span>
      </div>
      <div class="sales-wrap" :class="{ 'sales-active': salesIsShow }">
        <Sale v-for="(item, idx) in salesConditions" :key="idx"
              :day="new Date(item.Deadline).getDate()"
              :month="new Date(item.Deadline).getMonth()"
              :company="item.Partner"
              :inn="item.INN"
              :saleIndex="item.lostIndex"
              :taskType="item.TaskType"
              @toggleModal="isModalOpen=true"/>
      </div>
      <SaleModal
              :is-open="isModalOpen"
              @toggleModal="isModalOpen=false"
              @sortSales="sortSales"
      />
    </div>
    <myNotification
        :text="not_text"
        :textColor="not_color"
        v-show="is_not_show"/>        
  </div>
</template>

<script>
// @ is an alias to /src
import Sale from '@/components/sellers/sale.vue'
import SaleModal from '@/components/sellers/saleModal.vue'
import MyHeader from '@/components/other/myHeader.vue'
import myNotification from '@/components/other/notification.vue'
import Funcs from '../assets/js-funcs/default-funcs.js'

export default {
  name: 'sellers',
  components: {
    MyHeader,
    Sale,
    SaleModal,
    myNotification    
  },
  data: () => {
    return {
      not_text: 'Error',
      not_color: 'red',
      isModalOpen: false,
      is_not_show: false,
      salesConditions: [],
      customerApproval: [],
      supplierApproval: [],
      customerIsShow: false,
      supplierIsShow: false,
      salesIsShow: false
    }
  },
  methods: {
    showNotification(text, color) {
      this.not_text = text;
      this.not_color = color;
      this.is_not_show = true;
      setTimeout(() => {
        this.is_not_show = false;
      }, 1500);
    },
    openTaskList (exp) {
      switch (exp) {
        case "customer":
          this.customerIsShow = !this.customerIsShow;
          break;
        case "supplier":
          this.supplierIsShow = !this.supplierIsShow;
          break;
        case "sales":
          this.salesIsShow = !this.salesIsShow;
          break;
      }
    },
    sortSales (sales) {
      this.customerApproval = [];
      this.supplierApproval = [];
      this.salesConditions = [];
      sales.forEach((item, idx) => {
        switch (item.BusinessProcess) {
          case "Согласование заказа клиента":
            this.customerApproval.push(item);
            this.customerApproval[this.customerApproval.length - 1].lostIndex = idx;
            break;
          case "Согласование заказа поставщику":
            this.supplierApproval.push(item);
            this.supplierApproval[this.supplierApproval.length - 1].lostIndex = idx;
            break;
          case "Изменение условий продаж":
            this.salesConditions.push(item);
            this.salesConditions[this.salesConditions.length - 1].lostIndex = idx;
            break;
        }
      });
    }
  },
  beforeCreate() {
    Funcs.doRequest(
      'get',
      'https://erp.unlogic.ru/erp_local/hs/tasks/get/coordinator',
      null,
      null,
      res => {
        if (res.data.error) {
          this.showNotification(res.data.data, 'red');
        } else {
          this.$store.state.sales = res.data.data;
          this.sortSales(this.$store.state.sales);
        }

      },
      () => { this.showNotification('Сервер временно недоступен', 'red') }
    );
  },
}
</script>

<style lang="less">
	@import url('../assets/less-templates/base.less');
	.sellers {
		.flex(column, flex-start, center);
		width: 100%;
        height: auto;

    & h2 {
      padding: 10px 0;
    }

    & .content {
      .flex(column, flex-start, center);
      width: 100%;
      height: 100%;

      & .sales-wrap {
        .flex(column, flex-start, center);
        width: 100%;
        z-index: -1;
        opacity: 0;
        height: 0;
        transition: height .3s linear;
        }
      & .sales-active {
        height: auto;
        z-index: 0;
        opacity: 1;
      }
      & .toggle-wrap {
        .flex(row, space-between, center);
        width: 95%;
        padding: 10px 0;
        cursor: pointer;

        & h2 {
          font-size: 1.3em;
        }

        & span {
          transform: rotate(90deg);
          transition: transform .3s linear;
        }

        & .active-span {
          transform: rotate(-90deg);
        }
      }
    }
	}
</style>
