<template>
  <div class="logist">
    <MyHeader/>
    <FilterWrap/>
    <ActionsWrap/>
    <div class="blocks-container">
      <LogistBlock
          v-for="(item, idx) in $store.state.ttns" :key="idx"
          :ttn-number="item.Number"
          :ttn-date="item.TTN_Date"
          :ttn-status="item.TTN_Status"
          :ttn-consignee="item.Consignee"
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
		let val = Funcs.dateToInputs(new Date())[2] + ''
				+ Funcs.dateToInputs(new Date())[6] + ''
				+ Funcs.dateToInputs(new Date())[5];
		let val1 = Funcs.dateToInputs(new Date())[2] + ''
				+ (Funcs.dateToInputs(new Date())[3]) + ''
				+ Funcs.dateToInputs(new Date())[0];
		let data = {
			DateStart: val,
			DateEnd: val1
		}
		Funcs.doRequest(
			'get',
			this.$store.getters.getLinkByName('logist','getTTNS'),
			null,
			data,
			res => {
				if (!res.data.error) {
					if (res.data.data.length === 0) {
						this.showNotification('Список пуст!', 'red')
					} else {
						for (let i = 0; i <  res.data.data.length; i++) {
							res.data.data[i].isVissible = true
							res.data.data[i].isChecked = false;
						}
						this.$store.state.ttns = res.data.data;
					}
				} else {
					this.showNotification(res.data.report, 'red');
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
