const App = Vue.createApp({
  data() {
    return {
      datastore: [], //遠端資料
      showData: [], //單一頁面資料
      pageTotal: '', //總頁面數
      nowPage: 1,
    };
  },
  methods: {
    getData() {
      const jsonUrl = 'https://api.kcg.gov.tw/api/service/Get/9c8e1450-e833-499c-8320-29b36b7ace5c';

      axios.get(jsonUrl).then(res => {
        // 取得遠端資料
        this.datastore = res.data.data.XML_Head.Infos.Info;
        this.pagination(1);
      });
    },
    pagination(nowPage) {
      this.nowPage = nowPage;
      let len = this.datastore.length;
      const perpage = 19;
      //總頁面數量
      this.pageTotal = Math.ceil(len / perpage);

      //當前頁面第一筆以及最後一筆資料
      let pageStart = nowPage * 19 - 19 + 1;
      let pageEnd = nowPage * 19;
      this.showData = this.datastore.slice(pageStart, pageEnd);
    },
    nexPage() {
      if (this.nowPage == this.nowPage - 1) {
        return;
      } else {
        this.nowPage = this.nowPage + 1;
        this.pagination(this.nowPage);
      }
    },
    prevPage() {
      if (this.nowPage == 0) {
        return;
      } else {
        this.nowPage = this.nowPage - 1;
        this.pagination(this.nowPage);
      }
    },
    changePage(item) {
      this.nowPage = item;
      this.pagination(this.nowPage);
    },
  },

  created() {
    this.getData();
  },
});
App.component('card', {
  props: ['showdata'],
  template: `
        <div class="col-md-6 mt-4 " v-for="item in showdata" :key="item.id" >
          <div class="card">
           <div class="card bg-dark text-white text-left">
                <img class="card-img-top img-cover" height="155" :src="item.Picture1">
                <div class="card-img-overlay d-flex justify-content-between align-items-end p-0 px-3"
                    style="background-color: rgba(0, 0, 0, .2)">
                    <h5 class="card-img-title-lg">{{item.Name}}</h5>
                    <h5 class="card-img-title-sm">{{item.Zone}}</h5>
                </div>
            </div>

            <div class="card-body text-left">
                <p class="card-text"><i class="far fa-clock fa-clock-time"></i>&nbsp;{{item.Opentime}}</p>
                <p class="card-text"><i class="fas fa-map-marker-alt fa-map-gps"></i>&nbsp;{{item.Add}}</p>
                <p class="card-text"><i class="fas fa-mobile-alt fa-mobile"></i>&nbsp;{{item.Tel}}</p>
                <div v-if="item.Ticketinfo">
                    <p class="card-text"><i class="fas fa-tags text-warning"></i>&nbsp;{{item.Ticketinfo}}</p>
                </div>
            </div>
          </div>

      </div>`,
});
App.component('page-btn', {
  props: ['pageTotal', 'nowPage'],
  //  對要 emit 的事件進行聲明（declare）使用小駝峰命名
  emits: ['emitNextPage', 'emitPrevPage', 'emitNowPage'],
  methods: {
    clickNext() {
      this.$emit('emitNextPage');
    },
    clickPrev() {
      this.$emit('emitPrevPage');
    },
    clickNowPage(item) {
      this.$emit('emitNowPage', item);
      const elementBody = document.documentElement;
      elementBody.scrollTop = 0;
    },
  },
  template: `
        <li class="page-item" @click="clickPrev"><a class="page-link" href="#" >Previous</a></li>
        <li class="page-item" @click="clickNowPage(item)" :class='{"active":this.nowPage === item}'  v-for="item in pageTotal" :key="item"><a class="page-link">{{item}}</a></li>
        <li class="page-item" @click="clickNext"><a class="page-link" href="#">Next</a></li>`,
});

App.mount('#app');
