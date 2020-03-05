<template>
  <div class="missions">
    <MyHeader/>
    <MissionsFilter 
                v-bind:is-open="isModalOpen"
                @toggleModal="isModalOpen=true"/>
    <ActionsWrap 
        v-show="isSomeOneChecked[0]"
        :checkedArr="isSomeOneChecked[1]"/>
    <div class="global-wrap" 
      v-for="(obj, index) in this.ObjectsArr"
      :key="index">
      <div class="toggle-wrap"
        @click="openMissions(obj)">
        <h2>{{ obj.title }}</h2>
        <span :class="{ 'active-span': obj.missionsIsShow }">></span>
      </div>
      <div class="missions-wrap" :class="{ active: obj.missionsIsShow }">
        <Mission
                v-for="(item, idx) in $store.state.missions" :key="idx"
                v-show="item.isVissible"
                :title="item.Description"
                :employee="item.Performer"
                :limitDate="item.Deadline"
                :createDate="item.createDate"
                :missionIndex="idx"
                v-bind:is-open="isModalOpened"
                @toggleModal="isModalOpened=true"/>
      </div>
    </div>
    <MissionsModal
                v-bind:is-open="isModalOpen"
                @toggleModal="isModalOpen=false"
                :performers="this.$store.state.missionPerformers"
                :roles="this.$store.state.missionRoles"
    />
    <MissionOpenedModal
            v-bind:is-open="isModalOpened"
            @toggleModal="isModalOpened=false"/>
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
import ActionsWrap from '@/components/missions/actionsWrap.vue'
import MissionsModal from '@/components/missions/missionsModal.vue'
import MissionOpenedModal from '@/components/missions/missionOpenedModal.vue'
import myNotification from '@/components/other/notification.vue'
import Funcs from '../assets/js-funcs/default-funcs.js'

export default {
  name: 'missions',
  components: {
    MyHeader,
    Mission,
    MissionsFilter,
    ActionsWrap,
    MissionsModal,
    MissionOpenedModal,
    myNotification
  },
  data: () => {
    return {
      isModalOpen: false,
      isModalOpened: false,
      not_text: new String(''),
      not_color: new String(''),
      is_not_show: false,
      ObjectsArr: [
        {
          title: 'Поручения на контроле',
          missionsIsShow: false,
          isFull: false,
          path: 'control-list'
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
      }, 1500);
    },
    openMissions(item) {
      if (item.isFull) {
        item.missionsIsShow = !item.missionsIsShow;
      } else {
        Funcs.doRequest(
          'get',
          'https://erp.unlogic.ru/ecm/hs/tasks/get/' + item.path,
          null,
          null,
          res => {
            window.console.log(res.data.error);
            if (res.data.error) {
              this.showNotification(res.data.data, 'red');
            } else {
              for (let item in res.data.data) {
                res.data.data[item].isChecked = false;
                res.data.data[item].isVissible = true;
              }
              this.$store.state.missions = res.data.data;
              item.isFull = true;
              item.missionsIsShow = true;
            }
          },
          () => { this.showNotification('Сервер временно недоступен', 'red') }
        );
      }
    }      
  },
  computed: {
    isSomeOneChecked() {
      let checkedArr = [];
      for (let i in this.$store.state.missions) {
        let item = this.$store.state.missions[i];
        if (item.isChecked) {
          item.idx = i;
          checkedArr.push(item);
        }
      }
      if (checkedArr.length > 0)
        return [true, checkedArr];
      else
        return [false, null];
    }
  },
  beforeCreate() {
    Funcs.doRequest(
      'get',
      'https://erp.unlogic.ru/ecm/hs/tasks/get/performers',
      null,
      null,
      res => {
        window.console.log(res.data.error);
        if (!res.data.error) {
          this.$store.state.missionPerformers = res.data.data[0].Performers;
          this.$store.state.missionRoles = res.data.data[1].Performers;
          //window.console.log(this.$store.state.missionPerformers);
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

    & .global-wrap {
      .flex(column, flex-start, center);
      width: 100%;

      & .missions-wrap {
        .flex(column, flex-start, center);
        width: 100%;
        z-index: -2;
        opacity: 0;
        height: 0;
        transition: all .3s linear;
      }

      & .active {
        z-index: 1;
        opacity: 1;
      }
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
</style>
