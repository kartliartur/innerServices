<template>
  <div class="sellers">
    <MyHeader/>
   <!-- <h2 v-if="$store.state.sales.length == 0">Список пуст</h2>-->
    <div class="content" >
      <!--<h2 v-if="confirmArr.length > 0">Задачи согласования:</h2>
      <div class="sales-wrap">
        <Sale v-for="(item, idx) in confirmArr" :key="idx"
            :day="new Date(item.Deadline).getDate()"
            :month="new Date(item.Deadline).getMonth()"
            :company="item.Partner"
            :inn="item.INN"
            :saleIndex="item.lostIndex"
            @toggleModal="isModalOpen=true"/>        
      </div>
      <h2 v-if="learnArr.length > 0">Задачи ознакомления:</h2>
      <div class="sales-wrap">
        <Sale v-for="(item, idx) in learnArr" :key="idx"
              :day="new Date(item.Deadline).getDate()"
              :month="new Date(item.Deadline).getMonth()"
              :company="item.Partner"
              :inn="item.INN"
              :saleIndex="item.lostIndex"
              @toggleModal="isModalOpen=true"/>
      </div>-->
      <!--<div v-for="(item, idx) in sales" :key="idx">-->
      <div class="toggle-wrap">
        <h2>Согласование заказа клиента</h2>
        <span :class="{ 'active-span': customerIsShow }">></span>
      </div>
        <div class="sales-wrap">
          <Sale v-for="(item, idx) in customerApproval" :key="idx"
                :day="new Date(item.Deadline).getDate()"
                :month="new Date(item.Deadline).getMonth()"
                :company="item.Partner"
                :inn="item.INN"
                :saleIndex="item.lostIndex"
                @toggleModal="isModalOpen=true"/>
        </div>
      <!--</div>-->
      <h2 v-if="salesConditions.length > 0">Изменение условий продаж:</h2>
      <div class="sales-wrap">
        <Sale v-for="(item, idx) in salesConditions" :key="idx"
              :day="new Date(item.Deadline).getDate()"
              :month="new Date(item.Deadline).getMonth()"
              :company="item.Partner"
              :inn="item.INN"
              :saleIndex="item.lostIndex"
              @toggleModal="isModalOpen=true"/>
      </div>
      <!--<h2 v-if="customerApproval > 0">Согласование заказа клиента:</h2>
      <div class="sales-wrap">
        <Sale v-for="(item, idx) in customerApproval" :key="idx"
              :day="new Date(item.Deadline).getDate()"
              :month="new Date(item.Deadline).getMonth()"
              :company="item.Partner"
              :inn="item.INN"
              @toggleModal="isModalOpen=true"/>
      </div>
      <h2 v-if="supplierApproval > 0">Согласование заказа поставщику:</h2>
      <div class="sales-wrap">
        <Sale v-for="(item, idx) in supplierApproval" :key="idx"
              :day="new Date(item.Deadline).getDate()"
              :month="new Date(item.Deadline).getMonth()"
              :company="item.Partner"
              :inn="item.INN"
              @toggleModal="isModalOpen=true"/>
      </div>-->
      <SaleModal
              :is-open="isModalOpen"
              @toggleModal="isModalOpen=false"/>  
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
      confirmArr: new Array(),
      learnArr: new Array(),
      sales: [],
      salesConditions: [],
      customerApproval: [],
      supplierApproval: [],
      issues: [],
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
    }    
  },
  beforeCreate() {
    Funcs.doRequest(
      'get',
      'https://erp.unlogic.ru/api/v1/supervisor/task',
      null,
      null,
      res => {
        //window.console.log(res.data.error);
        window.console.log(res);
        if (res.data.error) {
          this.showNotification(res.data.data, 'red');
        } else {
          this.$store.state.sales = res.data.data;
          this.$store.state.sales.forEach(item => {
            switch (item.BusinessProcess) {
              case "Согласование заказа клиента":
                this.customerApproval.push(item);
                this.customerApproval.lastItem.lostIndex = this.customerApproval.lastIndex;
                break;
              case "Согласование заказа поставщику":
                this.supplierApproval.push(item);
                this.supplierApproval.lastItem.lostIndex = this.supplierApproval.lastIndex;
                break;
              case "Изменение условий продаж":
                this.salesConditions.push(item);
                this.salesConditions.lastItem.lostIndex = this.salesConditions.lastIndex;
                break;
            }
          });
          /*for (let i = 0; i < this.$store.state.sales.length; i++) {
            let item = this.$store.state.sales[i];
            if (item.TaskType == 0 || item.TaskType == 1) {
              this.confirmArr.push(item);
              this.confirmArr[this.confirmArr.length-1].lostIndex = i;
            } else {
              this.learnArr.push(item);
              this.learnArr[this.learnArr.length-1].lostIndex = i;
            }
          }*/
        }
        window.console.log(this.customerApproval);
        window.console.log(this.supplierApproval);
        window.console.log(this.salesConditions);
      },
      () => { this.showNotification('Сервер временно недоступен', 'red') }
    );
  },
  beforeMount() {
    /*this.sales = this.$store.state.sales;
    //window.console.log(this.sales);
    this.sales && this.sales.length > 0 ?
            this.sales.forEach(item => {
             switch (item.BusinessProcess) {
               case "Согласование заказа клиента":
                 this.customerApproval.push(item);
                 break;
               case "Согласование заказа поставщику":
                 this.supplierApproval.push(item);
                 break;
               case "Изменение условий продаж":
                 this.salesConditions.push(item);
                 break;
             }
            /!* if (item.BusinessProcess == "Согласование заказа поставщику") {
               this.supplierApproval.push(item);
             }*!/
            })
            : [];
    
   // window.console.log(this.supplierApproval, this.customerApproval, this.salesConditions);*/
  }
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
        height: 100%;
      }
    }
	}
</style>
