<template>
    <div class="global-wrap">
        <label>ТТН: </label>
        <div class="search-wrap">
            <input type="text"
                   @focus="isFocus = true"
                   @blur="isFocus = false"
                   v-model="ttnSearchValue"
                   @keyup="searchData(ttnSearchValue)"
            >
            <div class="hidden-list" :style="styleList" :class="{ active: isFocus }">
            <span
                    v-for="(item, idx) in this.items === '' ? this.options : this.items" :key="idx"
                    @click="fillData(item)"
            >
                {{ item.ttn }}
            </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "searchInput",
        //props: ["options"],
        data: () => {
            return {
                options: [
                    {
                        ttn: "100",
                        phone: "71111111111",
                        status: "100"
                    },
                    {
                        ttn: "200",
                        phone: "72222222222",
                        status: "200"
                    },
                    {
                        ttn: "300",
                        phone: "73333333333",
                        status: "300"
                    }
                ],
                items: "",
                ttnSearchValue: "",
                isFocus: false,
                status: "",
                phone: "",
                styleList: "",
            }
        },
        methods: {
            fillData (value) {
                if (value) {
                    window.console.log(value);
                    this.ttnSearchValue = value.ttn;
                    this.$parent.$data.ttn = value.ttn;
                    this.$parent.$data.status = value.status;
                    this.$parent.$data.phone = value.phone;
                    localStorage.setItem('ttn', value.ttn);
                    localStorage.setItem('phone', value.phone);
                    localStorage.setItem('status', value.status);
                }
            },
            searchData (searchValue) {
                if (searchValue !== "" && searchValue !== undefined && searchValue) {
                   this.items = this.options.filter(e => {
                        return e.ttn.includes(searchValue)
                    });
                   if (this.items.length === 0) {
                       this.items = "";
                       this.styleList = 'height: 0; border: unset;';
                   }
                   if (this.items.length === 1) {
                       this.styleList = "height: 29px;"
                   }
                } else {
                    this.items = this.options;
                    this.styleList = "height: 50px;"
                }

            }
        },
        beforeMount() {
            this.ttnSearchValue = (localStorage.getItem('ttn') && localStorage.getItem('ttn') !== "undefined") ? localStorage.getItem('ttn') : "";
        },
        /*beforeCreate() {
            this.items = this.options;
        }*/
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
            overflow: scroll;
            transition: all .3s linear;

            & span {
                .flex(row, flex-start, center);
                width: 100%;
                color: #000;
                border-bottom: 1px solid @green-color;
                padding: 5px 10px;
            }
        }

        .active {
            height: 50px;
            z-index: 99;

            & span {
                color: #000;
                //border: 1px solid @green-color;
            }
        }
    }
</style>