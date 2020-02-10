<template>
  <div class="logist">
    <MyHeader/>
    <FilterWrap/>
    <ActionsWrap/>
    <div class="blocks-container">
      <LogistBlock
          v-for="(item, idx) in $store.state.ttns" :key="idx"
          :ttn-number="item.TTNNumber"
          :ttn-date="item.TTNDate"
          :ttn-status="item.TTNStatus"
          :ttn-company="item.PaymentCompany"
          :ttn-index="idx"
          :is-open="isModalOpen"
          v-show="item.isVissible"
          @toggleModal="isModalOpen=true"/>
    </div>
    <ModalFrame
        v-bind:is-open="isModalOpen"
        @toggleModal="isModalOpen=false"/>
    <myNotification
        :text="not_text"
        :textColor="not_color"
        v-show="is_not_show"/>
  </div>
</template>


<script>
import FilterWrap from '@/components/logist/filterWrap.vue'
import LogistBlock from '@/components/logist/logistBlock.vue'
import ModalFrame from '@/components/logist/modalFrame.vue'
import ActionsWrap from '@/components/logist/actionsWrap.vue'
import MyHeader from '@/components/other/myHeader.vue'
import myNotification from '@/components/other/notification.vue'
import Funcs from '../assets/js-funcs/default-funcs.js'

export default {
	name: 'logistic',
	components: {
		FilterWrap,
		LogistBlock,
		ModalFrame,
		ActionsWrap,
		MyHeader,
    myNotification
	},
	data: function () {
		return {
			isModalOpen: false,
      not_text: 'Ошибка',
      not_color: 'red',
      is_not_show: false
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
		}
  },
	beforeCreate() {
		// let val = Funcs.dateToInputs(new Date())[2] + '-'
		// 		+ Funcs.dateToInputs(new Date())[1] + '-'
		// 		+ Funcs.dateToInputs(new Date())[0];
		// let val1 = Funcs.dateToInputs(new Date())[2] + '-'
		// 		+ (Funcs.dateToInputs(new Date())[3]) + '-'
		// 		+ Funcs.dateToInputs(new Date())[0];
		let data = {
			date_start: "2018-12-09",
			date_end: "2018-12-10"
		}
		Funcs.doRequest(
			'get',
			'https://erp.unlogic.ru/api/v1/logistic/ttn',
			null,
			data,
			res => {
        if (!res.data.error) {
          for (let i = 0; i <  res.data.data.length; i++) {
            res.data.data[i].TTNDate = Funcs.dateToInputs(new Date(res.data.data[i].TTNDate))[2] + '-'
              + Funcs.dateToInputs(new Date(res.data.data[i].TTNDate))[1] + '-'
              + Funcs.dateToInputs(new Date(res.data.data[i].TTNDate))[0];
            res.data.data[i].DateDelivery = Funcs.dateToInputs(new Date(res.data.data[i].DateDelivery))[2] + '-'
              + Funcs.dateToInputs(new Date(res.data.data[i].DateDelivery))[1] + '-'
              + Funcs.dateToInputs(new Date(res.data.data[i].DateDelivery))[0];
            res.data.data[i].isVissible = true
            res.data.data[i].isChecked = false;
          }
          this.$store.state.ttns = res.data.data;
        } else {
          this.showNotification(res.data.data, 'red');
        }
      },
      () => { this.showNotification('Сервер временно недоступен', 'red'); }
		)
	}
}

</script>

<style lang="less">
	@import url('../assets/less-templates/base.less');
	.logist {
		.flex(column, flex-start, center);
		width: 100%;
		height: auto;
		min-height: 100vh;

		& .blocks-container {
			.flex(column, flex-start, center);
			width: 100%;
		}
	}
</style>
