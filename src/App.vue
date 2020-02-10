<template>
  <div id="app">
    <router-view/>
    <div class="preload-wrap" id="preload">
      <img src="../src/assets/preload.png" width="100px" alt="">
      <svg class="spinner" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="1" stroke-miterlimit="10"></circle>
      </svg>
    </div>
  </div>
</template>

<script>

</script>

<style lang="less">
  @import url('assets/less-templates/base.less');
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    } 50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    } 100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px; 
    }
  }
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    outline: none;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
  }
  
  body {
    background: #f1f1f1;
  }

  #app {
    height: auto;
    min-height: 100vh;
    width: 100%;
    background: #f1f1f1;
  }

  .preload-wrap {
    .flex(column, center, center);
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: @green-color;
    z-index: 10000000;

    & .spinner {
      height: 200px;
      width: 200px;
      animation: rotate 2s linear infinite;
      transform-origin: center center;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;      

      & .path {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
        animation: dash 1.5s ease-in-out infinite;
        stroke-linecap: round;
        stroke: #fff;
      }
    }
  }
</style>
