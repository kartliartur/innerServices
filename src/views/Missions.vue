<template>
  <div class="missions">
    <MyHeader/>
    <MissionsFilter 
                v-bind:is-open="isModalOpen"
                @toggleModal="isModalOpen=true"/>
    <div class="missions-wrap">
      <Mission
              v-for="(item, idx) in $store.state.missions" :key="idx"
              :title="item.Description"
              :employee="item.Performer"
              :limitDate="item.Deadline"
              :createDate="item.createDate"
              :missionIndex="idx"/>
    </div>
    <MissionsModal
                v-bind:is-open="isModalOpen"
                @toggleModal="isModalOpen=false"/>
    <myNotification
        :text="not_text"
        :textColor="not_color"
        v-show="is_not_show"/> 
  </div>
</template>

<script>
// @ is an alias to /src
import MyHeader from '@/components/other/myHeader.vue'
import Mission from '@/components/missions/mission.vue'
import MissionsFilter from '@/components/missions/missionsFilter.vue'
import MissionsModal from '@/components/missions/missionsModal.vue'
import myNotification from '@/components/other/notification.vue'
import Funcs from '../assets/js-funcs/default-funcs.js'

export default {
  name: 'missions',
  components: {
    MyHeader,
    Mission,
    MissionsFilter,
    MissionsModal,
    myNotification
  },
  data: () => {
    return {
      isModalOpen: false,
      not_text: new String(''),
      not_color: new String(''),
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
      }, 1500);
    }      
  },
  beforeCreate() {
    Funcs.doRequest(
      'get',
      'https://erp.unlogic.ru/api/v1/top_managers_instructions/instructions',
      null,
      null,
      res => {
        window.console.log(res.data.error);
        if (res.data.error) {
          this.showNotification(res.data.data, 'red');
        } else {
          for (let item in res.data.data) {
            res.data.data[item].isChecked = false;
          }
          this.$store.state.missions = res.data.data;
        }
      },
      () => { this.showNotification('Сервер временно недоступен', 'red') }
    );
    Funcs.doRequest(
      'get',
      'https://erp.unlogic.ru/api/v1/top_managers_instructions/performers',
      null,
      null,
      res => {
        window.console.log(res.data.error);
        if (!res.data.error) {
          this.$store.state.missionPerformers = res.data.data[0].Performers;
          window.console.log(this.$store.state.missionPerformers);
        }
      },
      () => { this.showNotification('Сервер временно недоступен', 'red') }
    );   
  }
}
</script>

<style lang="less">
	@import url('../assets/less-templates/base.less');
	.missions {
		.flex(column, flex-start, center);
		width: 100%;
		height: 100vh;
	}
</style>
