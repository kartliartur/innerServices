<template>
  <div class="sellers">
    <MyHeader/>
    <h2 v-if="$store.state.sales.length == 0">Список пуст</h2>
    <div class="content" v-else>
      <h2 v-if="confirmArr.length > 0">Задачи согласования:</h2>
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
      </div>
      <SaleModal
              v-bind:is-open="isModalOpen"
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
      learnArr: new Array()
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
        window.console.log(res.data.error);
        if (res.data.error) {
          window.console.log(res.data.data);
          this.showNotification(res.data.data, 'red');
        } else {
          this.$store.state.sales = res.data.data;
          for (let i = 0; i < this.$store.state.sales.length; i++) {
            let item = this.$store.state.sales[i];
            if (item.TaskType == 0 || item.TaskType == 1) {
              this.confirmArr.push(item);
              this.confirmArr[this.confirmArr.length-1].lostIndex = i;
            } else {
              this.learnArr.push(item);
              this.learnArr[this.learnArr.length-1].lostIndex = i;
            }
          }
        }
      },
      () => { this.showNotification('Сервер временно недоступен', 'red') }
    );
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
