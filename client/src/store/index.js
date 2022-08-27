import { defineStore } from 'pinia'

export default defineStore('admin', {
    state: () => {
        return {
            id: 0,
            account: '',
            token: '',
            loged:false
        }
    },
    actions: {
        checkState() {
            if (localStorage.account == 'admin' && localStorage.password == '123456') {
                this.loged = true;
            }
        },
        outState() {
            this.loged = false;
        }
    },
    getters: {},
})