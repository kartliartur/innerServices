<template>
  <table :style="{ height: tableHeight }">
    <thead>
      <tr>
        <th v-for="(item, index) in heads" :key="index"
            :style="{ width: (100/heads.length) + '%' }">
          {{ item }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, idx) in content" :key="idx">
        <td v-for="(i, index) in item" :key="index"
            :class="{ title: i.isTitle }"
            :style="{ width: (100/item.length) + '%' }">
          {{ i.text || i }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
	export default {
		name: 'myTable',
    props: ['heads', 'content',],
    computed: {
      tableHeight() {
        let height = 0;
        if (this.content.length < 10)
          height = 'auto';
        else 
          height = '600px';
        return height;
      }
    }
	}
</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
  table {
    .flex(column, flex-start, center);
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border: 1px solid #eee;
    overflow: scroll;

    &::-webkit-scrollbar {
      border-radius: 15%;
      width: 5px;
      height: 5px;
      opacity: .8;
    }
    /* Track */
    &::-webkit-scrollbar-track {
      background: #fff;
      opacity: .8;
      padding: 0;
      border-radius: 5px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      opacity: .8;
      padding: 0;
      border-radius: 5px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }

    & tbody, thead {
      width: 100%;
    }

    & thead {
      position: sticky;
      position: -webkit-sticky;
      top: 0;
      z-index: 999;
      background: #fff;

      & th {
        position: sticky;
        position: -webkit-sticky;
        top: 0;
        z-index: 999;   
        background: #fff;
        border-bottom: 1px solid #eee; 
      }
    }

    & tr {
      .flex(row, flex-start, center);
      min-width: 100%;
      width: auto;
      height: 55px;
      
      & td, th {
        .flex(row, center, center);
        border-left: 1px solid #eee;
        border-right: 1px solid #eee;
        padding: 0 10px;
        text-align: center;
        font-weight: 300;
        min-width: 200px;
        height: 100%;
      }

      & td:first-child {
        justify-content: flex-start;
        text-align: left;
        padding-left: 30px;
      }

      & td.title {
        padding-left: 10px;
        font-weight: bold;
      }
    }

    & tr:nth-child(2n) {
      & td { background: #f7f7f7; }
    }
  }
</style>
