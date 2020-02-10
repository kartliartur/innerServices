<template>
    <div class="tracking">
        <MyHeader />
        <form class="tracking_form">
            <div>
                <search-input
                        @input="fillData(value)"
                        dataArray="asd"/>
            </div>

            <div class="tracking-item">
                <label>Телефон: </label>
                <input type="text" ref="phone" class="phone" :value="this.phone"/>
            </div>

            <div class="tracking-item">
                <label>Статус: </label>
                <span class="status-item">{{ this.status }}</span>
             </div>

            <div class="tracking_button">
                <button>Отслеживать</button>
            </div>

        </form>
    </div>
</template>

<script>

    import MyHeader from "../components/other/myHeader";
    import searchInput from '../components/tracking/searchInput';

    export default {
        name: "Tracking",
        components: {MyHeader, searchInput},
        data: () => {
            return {
                ttn: "",
                status: "",
                value: {},
                phone: "",
                options: [
                    {
                        ttn: "100",
                        phone: 100,
                        status: "100"
                    },
                    {
                        ttn: 200,
                        phone: 200,
                        status: "200"
                    },
                    {
                        ttn: 300,
                        phone: 300,
                        status: "300"
                    }
                ]

            }
        },
        methods: {
            fillData (value) {
                window.console.log(value);
                if (value) {
                    window.console.log(value);
                    this.status = value.status;
                    this.phone = value.phone;
                    localStorage.setItem('ttn', value.ttn);
                    localStorage.setItem('phone', value.phone);
                    localStorage.setItem('status', value.status);
                }
            }
        },
        beforeMount() {
            this.phone = (localStorage.getItem('phone') && localStorage.getItem('phone') !== "undefined") ? localStorage.getItem('phone') : "";
            this.status = (localStorage.getItem('status') && localStorage.getItem('status') !== "undefined") ? localStorage.getItem('status') : "";
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="less">
    @import url('../assets/less-templates/base.less');
    .tracking_form {
        .flex(column, center, stretch);
        padding: 20px 0;
        margin: 0 10px;

        & .tracking-item {
            .flex(row, space-between, center);
            width: 100%;
            margin: 10px 0;
            & input {
                width: 60%;
            }

            & .status-item {
                .input();
                width: 60%;
                padding: 10px;
            }
        }

        & input {
            .input();
             //width: auto;
             padding: 10px;
        }
        & label {
            color: @green-color;
        }
        & .tracking_button {
            .button(5px, @green-color, @input-bg);
            align-self: center;
        }
    }
</style>