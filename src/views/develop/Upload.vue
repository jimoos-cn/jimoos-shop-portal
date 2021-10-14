<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col>
        <h3>存储选择</h3>
      </a-col>
      <a-col class="storage-select">
        <span class="storage-label">本地存储：</span>
        <a-switch
          @change="changeStorage"
          checked-children="开"
          un-checked-children="关"
          v-model="localStorage"
        />
      </a-col>
      <a-col class="storage-select">
        <span class="storage-label">华为obs：</span>
        <a-switch
          @change="changeStorage"
          checked-children="开"
          un-checked-children="关"
          v-model="huaweiObs"
        />
      </a-col>
    </a-row>
    <a-tabs type="card">
      <a-tab-pane key="1" tab="本地存储配置">
        <a-row :gutter="16">
          <a-col :md="24" :lg="16">
            <a-form layout="vertical">
              <a-form-item label="本地存储配置">
                <a-input
                  disabled
                  v-model="local.keyword"
                />
              </a-form-item>
              <a-form-item label="配置内容">
                <a-textarea
                  v-model="local.content"
                  rows="16"
                />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="saveSetting(0)">{{ $t('account.settings.basic.update') }}</a-button>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
            <div class="setting-description">
              <h3>&nbsp;&nbsp;配置说明</h3>
              <h4>本地存储配置</h4>
              <div>
                <b>配置关键词</b>: <code>local.storage</code> <br>
                <b>配置内容</b>
                <pre>
{
  "rootPath": "请填写根目录",
  "host": "请填写访问的域名",
}
            </pre>
              </div>
              <h4>注意事项</h4>
              <p>
                配置修改后，需要重启服务才会生效。
              </p>
            </div>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="2" tab="华为obs配置">
        <a-row :gutter="16">
          <a-col :md="24" :lg="16">
            <a-form layout="vertical">
              <a-form-item label="OBS配置关键词">
                <a-input
                  disabled
                  v-model="obs.keyword"
                />
              </a-form-item>
              <a-form-item label="配置内容">
                <a-textarea
                  v-model="obs.content"
                  rows="16"
                />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="saveSetting(1)">{{ $t('account.settings.basic.update') }}</a-button>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
            <div class="setting-description">
              <h3>&nbsp;&nbsp;配置说明</h3>
              <h4>华为OBS配置</h4>
              <div>
                <b>配置关键词</b>: <code>huawei.obs</code> <br>
                <b>配置内容</b>
                <pre>
{
  "accessKey": "请填写accessKey",
  "secretKey": "请填写secretKey",
  "endPoint": "请填写 endPoint 地址",
  "duration": 3600,
  "buckets": [
    {
      "type": 0,
      "bucketName": "bucketName1"
    },
    {
      "type": 1,
      "bucketName": "bucketName2"
    }
  ]
}
            </pre>
              </div>
              <h4>注意事项</h4>
              <p>
                配置修改后，需要重启服务才会生效。
              </p>
            </div>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { getSettingByKey, writeSettings } from '@/api/setting'
import { changeStorage, checkStorage } from '@/api/obs'

export default {
  mounted () {
    checkStorage().then(res => {
      this.localStorage = res.localStorage
      this.huaweiObs = res.huaweiObs
      getSettingByKey({
        keyword: 'local.storage'
      }).then((res) => {
        this.local = {
          keyword: 'local.storage',
          ...res
        }
      })
      getSettingByKey({
        keyword: 'huawei.obs'
      }).then((res) => {
        this.obs = {
          keyword: 'huawei.obs',
          ...res
        }
      })
    })
  },
  data () {
    return {
      local: {
        keyword: 'local.storage'
      },
      obs: {
        keyword: 'huawei.obs'
      },
      localStorage: false,
      huaweiObs: false
    }
  },
  methods: {
    saveSetting (type) {
      const _this = this
      console.log('shopInfo:' + JSON.stringify(this.shopInfo))
      writeSettings(type === 0 ? this.local : this.obs).then(() => {
        _this.$message.success('更新成功!')
      })
    },
    changeStorage () {
      changeStorage().then(res => {
        this.localStorage = res.localStorage
        this.huaweiObs = res.huaweiObs
      })
    }
  }
}
</script>

<style lang="less" scoped>
.setting-description {
  padding: 0 20px;
  color: rgba(0, 0, 0, 0.45);
}
.storage-select {
  margin: 10px 0;
  padding: 10px 0;
  .storage-label {
    display: inline-block;
    min-width: 70px;
  }
}
</style>
