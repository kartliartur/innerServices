<template>
    <div class="global-wrap">
        <label>Номер документа: </label>
        <div class="search-wrap">
            <input type="text"
                   @focus="isFocus = true"
                   @blur="isFocus = false"
                   v-model="documentValue"
                   @input="searchData(documentValue)"
            >
            <span class="deleter" @click="clearData()">×</span>
            <div class="hidden-list" :style="styleList" :class="{ active: isFocus }">
            <span
                    v-for="(item, idx) in this.items === '' ? this.options : this.items" :key="idx"
                    @click="selectItem(item)"
            >
                {{ item.document_id }}
            </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "searchInput",
        props: {
            options: {
                type: Array,
                default: () => []
            },
            fillData: {
                type: Function,
            },
        },
        data: () => {
            return {
                items: "",
                documentValue: "",
                isFocus: false,
                status: "",
                phone: "",
                styleList: "",
            }
        },
        methods: {
            clearData() {
              this.fillData({
                document_id: '',
                phone: '',
                driver: '',
                Waybill_GUID: ''
              });
              this.documentValue = "";
              this.$parent.$data.timers = [];
              localStorage.setItem("timers", []);
            },

            selectItem (value) {
                this.fillData(value);
            },

            searchData () {
                this.documentValue = this.documentValue.toUpperCase();
                if (this.documentValue !== "" && this.documentValue !== undefined && this.documentValue) {
                   this.items = this.options.filter(e => {
                        return e.document_id.includes(this.documentValue)
                    });
                   if (this.items.length === 0) {
                       this.items = "";
                       this.styleList = 'height: 0; border: unset;';
                   }
                   if (this.items.length <= 2) {
                       this.styleList = "height: " + 28 * this.items.length + "px;"
                   }
                   if (this.items.length >= 3) {
                       this.styleList = "height: 200px;"
                   }
                } else {
                    this.items = this.options;
                    this.styleList = "height: 200px;"
                }
            }
        },
        beforeMount() {
            this.documentValue = (localStorage.getItem('document_id') && localStorage.getItem('document_id') !== "undefined") ? localStorage.getItem('document_id') : "";
            this.items = this.options ? this.options : "";
            if (this.options.length <= 2 && this.options.length !== 0) {
                this.styleList = "height: " + 28 * this.options.length + "px;"
            }
        },
    }
</script>

<style lang="less">
    @import url('../../assets/less-templates/base.less');
    .global-wrap {
        .flex(row, space-between, center);
        width: 100%;
        margin-bottom: 10px;
    }
    .search-wrap {
        .flex(row, flex-start, center);
        position: relative;
        width: 60%;

        & input {
            width: 100%;
        }

        .deleter {
          position: absolute;
          top: 5px;
          right: 10px;
          font-weight: bold;
          font-size: 1.5em;
          cursor: pointer;
          color: @alert-color;
        }

        & .hidden-list {
            .flex(column, flex-start, center);
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            height: 0;
            border: 1px solid @green-color;
            background: #fafafa;
            z-index: -2;
            overflow-y: scroll;
            transition: all .3s linear;

            & span {
                .flex(row, flex-start, center);
                width: 100%;
                color: #000;
                border-bottom: 1px solid @green-color;
                padding: 0 10px;
                min-height: 30px;
            }
        }

        & .active {
            height: 300px;
            z-index: 99;

            & span {
                color: #000;
            }
        }
    }
</style>
