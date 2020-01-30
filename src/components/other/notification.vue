<template>
  <div class="notif-wrap">
    <div class="hover"></div>
    <div class="notif-window">
      <h2 :style="{color: textColor}">{{ text }}</h2>
    </div>
  </div>
</template>

<script>
	export default {
		name: 'myNotification',
    props: ['text', 'textColor']
	}
</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
  .notif-wrap {
    .flex(column, flex-start, center);
    position: fixed;
    padding-top: 100px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 100000;

    & .hover {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100000;
      background: #000;
      opacity: 0.9;
    }

    & .notif-window {
      .flex(column, center, center);
      width: 300px;
      padding: 20px 0;
      background: #fff;
      box-shadow: 2px 2px 14px 2px rgba(255,255,255,.8);
      border-radius: 5px;
      z-index: 100001;

      & h2 {
        width: 100%;
        text-align: center;
      }
    }
  }
</style>
