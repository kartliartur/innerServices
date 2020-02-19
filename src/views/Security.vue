<template>
  <div class="security">
    <MyHeader/>
    <h2>{{ securityTitle }}</h2>
    <div class="block-container">
      <SecurityBlock
                    v-for="(item, idx) in $store.state.tasks" :key="idx"
                    :date="item.Deadline"
                    :company-name="item.Partner"
                    :inn="item.INN"
                    :text="item.Description"
                    :task-index="idx"
                    @toggleModal="isModalOpen=true"/>
    </div>
    <SecurityModal
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
import SecurityBlock from '@/components/security/sec-block.vue'
import SecurityModal from '@/components/security/secModal.vue'
import myNotification from '@/components/other/notification.vue'
import Funcs from '../assets/js-funcs/default-funcs.js'


export default {
  name: 'security',
  components: {
    MyHeader,
    SecurityBlock,
    SecurityModal,
    myNotification
  },
  data: () => {
    return {
      isModalOpen: false,
      not_text: '',
      not_color: '',
      is_not_show: false,
      securityTitle: 'Задачи:'
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
    Funcs.doRequest(
      'get',
      'https://erp.unlogic.ru/api/v1/security/task',
      null,
      null,
      res => {
        if (!res.data.error) {
          if (res.data.data.length > 0)
            this.$store.state.tasks = res.data.data;
          else 
            this.securityTitle = 'Список пуст';
        } else {
          this.showNotification('Список задач пуст', 'red')
        }
      },
      () => { this.showNotification('Сервер временно недоступен', 'red') }
    );
  }
}
</script>

<style lang="less">
	@import url('../assets/less-templates/base.less');
	.security {
		.flex(column, flex-start, center);
		width: 100%;
		height: 100vh;

    & h2 {
      margin: 5px 0;
      font-size: 1.2em;
    }

    & .block-container {
      .flex(column, flex-start, center);
      width: 100%;
    }
	}
</style>