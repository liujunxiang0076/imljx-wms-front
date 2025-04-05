<script setup lang="ts">
import { ref, onMounted, reactive, h } from 'vue';
import { Card, Col, Row, Statistic, Table, Progress, Tabs, DatePicker, Button, message } from 'ant-design-vue';
import { ArrowUpOutlined, ArrowDownOutlined, ReloadOutlined, FilterOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import config from '../../config';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface StatData {
  title: string;
  value: number;
  precision: number;
  prefix?: string;
  suffix?: string;
  status?: 'up' | 'down';
  change?: number;
  color?: string;
  icon?: any;
}

// 仪表盘加载状态
const loading = ref(false);

// 统计卡片数据
const statsData = ref<StatData[]>([
  {
    title: '今日入库总数',
    value: 1260,
    precision: 0,
    suffix: '件',
    status: 'up',
    change: 12.5,
    color: '#1890ff',
    icon: ArrowUpOutlined
  },
  {
    title: '今日出库总数',
    value: 920,
    precision: 0,
    suffix: '件',
    status: 'down',
    change: 5.2,
    color: '#52c41a',
    icon: ArrowDownOutlined
  },
  {
    title: '库存总量',
    value: 8756,
    precision: 0,
    suffix: '件',
    color: '#722ed1'
  },
  {
    title: '库存金额',
    value: 435621.5,
    precision: 2,
    prefix: '¥',
    color: '#faad14'
  },
  {
    title: '本月入库金额',
    value: 278450.35,
    precision: 2,
    prefix: '¥',
    status: 'up',
    change: 15.8,
    color: '#eb2f96',
    icon: ArrowUpOutlined
  },
  {
    title: '本月出库金额',
    value: 189320.78,
    precision: 2,
    prefix: '¥',
    status: 'up',
    change: 8.3,
    color: '#fa8c16',
    icon: ArrowUpOutlined
  },
  {
    title: '库存周转率',
    value: 4.2,
    precision: 1,
    suffix: '次/月',
    color: '#13c2c2'
  },
  {
    title: '订单满足率',
    value: 96.8,
    precision: 1,
    suffix: '%',
    color: '#1890ff'
  }
]);

// 库存预警数据
const stockAlertColumns = [
  {
    title: '货物编码',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '货物名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '当前库存',
    dataIndex: 'currentStock',
    key: 'currentStock',
  },
  {
    title: '安全库存',
    dataIndex: 'safetyStock',
    key: 'safetyStock',
  },
  {
    title: '库存状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }: { text: string }) => {
      const color = text === '库存不足' ? 'red' : text === '库存过高' ? 'orange' : 'green';
      return h('span', { style: { color } }, text);
    }
  },
  {
    title: '所在库位',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '操作',
    key: 'action',
    customRender: () => {
      return h('div', [
        h('a', { href: 'javascript:;', style: { marginRight: '8px' } }, '补货'),
        h('a', { href: 'javascript:;' }, '详情')
      ]);
    },
  }
];

const stockAlertData = ref([
  {
    key: '1',
    code: 'P001',
    name: '智能手表 A1',
    currentStock: 15,
    safetyStock: 30,
    status: '库存不足',
    location: 'A区-01-02'
  },
  {
    key: '2',
    code: 'P002',
    name: '无线耳机 B2',
    currentStock: 5,
    safetyStock: 20,
    status: '库存不足',
    location: 'A区-03-01'
  },
  {
    key: '3',
    code: 'P003',
    name: '智能手机 C3',
    currentStock: 28,
    safetyStock: 30,
    status: '库存正常',
    location: 'B区-02-03'
  },
  {
    key: '4',
    code: 'P004',
    name: '平板电脑 D4',
    currentStock: 150,
    safetyStock: 50,
    status: '库存过高',
    location: 'B区-03-02'
  },
  {
    key: '5',
    code: 'P005',
    name: '蓝牙音箱 E5',
    currentStock: 8,
    safetyStock: 25,
    status: '库存不足',
    location: 'C区-01-04'
  }
]);

// 最近入库数据
const recentInboundColumns = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: '入库时间',
    dataIndex: 'inboundTime',
    key: 'inboundTime',
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }: { text: string }) => {
      const color = text === '已完成' ? 'green' : text === '处理中' ? 'blue' : 'orange';
      return h('span', { style: { color } }, text);
    }
  }
];

const recentInboundData = ref([
  {
    key: '1',
    orderNo: 'IN202404020001',
    productName: '智能手表 A1',
    quantity: 100,
    inboundTime: '2024-04-02 08:30:12',
    operator: '张三',
    status: '已完成'
  },
  {
    key: '2',
    orderNo: 'IN202404020002',
    productName: '无线耳机 B2',
    quantity: 200,
    inboundTime: '2024-04-02 09:15:27',
    operator: '李四',
    status: '已完成'
  },
  {
    key: '3',
    orderNo: 'IN202404020003',
    productName: '智能手机 C3',
    quantity: 50,
    inboundTime: '2024-04-02 10:05:43',
    operator: '王五',
    status: '已完成'
  },
  {
    key: '4',
    orderNo: 'IN202404020004',
    productName: '平板电脑 D4',
    quantity: 30,
    inboundTime: '2024-04-02 11:22:18',
    operator: '赵六',
    status: '处理中'
  },
  {
    key: '5',
    orderNo: 'IN202404020005',
    productName: '蓝牙音箱 E5',
    quantity: 80,
    inboundTime: '2024-04-02 13:45:32',
    operator: '钱七',
    status: '待验收'
  }
]);

// 最近出库数据
const recentOutboundData = ref([
  {
    key: '1',
    orderNo: 'OUT202404020001',
    productName: '智能手表 A1',
    quantity: 80,
    inboundTime: '2024-04-02 09:12:32',
    operator: '张三',
    status: '已完成'
  },
  {
    key: '2',
    orderNo: 'OUT202404020002',
    productName: '无线耳机 B2',
    quantity: 120,
    inboundTime: '2024-04-02 10:25:47',
    operator: '李四',
    status: '已完成'
  },
  {
    key: '3',
    orderNo: 'OUT202404020003',
    productName: '智能手机 C3',
    quantity: 30,
    inboundTime: '2024-04-02 11:18:23',
    operator: '王五',
    status: '已完成'
  },
  {
    key: '4',
    orderNo: 'OUT202404020004',
    productName: '平板电脑 D4',
    quantity: 15,
    inboundTime: '2024-04-02 14:05:38',
    operator: '赵六',
    status: '拣货中'
  },
  {
    key: '5',
    orderNo: 'OUT202404020005',
    productName: '蓝牙音箱 E5',
    quantity: 45,
    inboundTime: '2024-04-02 15:32:11',
    operator: '钱七',
    status: '待发运'
  }
]);

// 货物分类占比数据
const categoryData = reactive([
  { name: '电子设备', value: 45, color: '#1890ff' },
  { name: '办公用品', value: 25, color: '#52c41a' },
  { name: '生活用品', value: 15, color: '#fa8c16' },
  { name: '服装鞋帽', value: 10, color: '#eb2f96' },
  { name: '其他', value: 5, color: '#722ed1' }
]);

// 库位使用率数据
const locationUsageData = reactive([
  { name: 'A区', usage: 85, color: '#f5222d' },
  { name: 'B区', usage: 68, color: '#fa8c16' },
  { name: 'C区', usage: 72, color: '#52c41a' },
  { name: 'D区', usage: 45, color: '#1890ff' }
]);

// 设置当前活动标签页
const activeTabKey = ref('1');

// 刷新数据
const refreshData = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    message.success('数据已更新');
  }, 1000);
};

// 导出数据
const exportData = () => {
  message.success('数据导出成功');
};

// 加载数据
onMounted(() => {
  // 模拟API请求获取数据
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 800);
});
</script>

<template>
  <div class="dashboard-container">
    <div class="page-header">
      <div class="left">
        <h2>仪表盘</h2>
        <p>欢迎使用{{ config.system.systemName }}</p>
      </div>
      <div class="right">
        <RangePicker style="margin-right: 16px" />
        <Button type="primary" :loading="loading" @click="refreshData">
          <template #icon><ReloadOutlined /></template>
          刷新
        </Button>
        <Button style="margin-left: 8px" @click="exportData">
          <template #icon><DownloadOutlined /></template>
          导出
        </Button>
      </div>
    </div>
    
    <!-- 统计卡片 -->
    <Row :gutter="[16, 16]" class="stats-row">
      <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" v-for="(stat, index) in statsData" :key="index">
        <Card hoverable :loading="loading">
          <Statistic
            :title="stat.title"
            :value="stat.value"
            :precision="stat.precision"
            :prefix="stat.prefix"
            :suffix="stat.suffix"
            :value-style="{ color: stat.color }"
          />
          <template v-if="stat.status">
            <div class="stat-change">
              <component :is="stat.icon" />
              <span>{{ stat.change }}%</span>
              <span class="change-text">较上{{ stat.status === 'up' ? '升' : '降' }}</span>
            </div>
          </template>
        </Card>
      </Col>
    </Row>
    
    <!-- 库存预警与库位使用 -->
    <Row :gutter="16" class="chart-row">
      <!-- 库存预警 -->
      <Col :xs="24" :lg="16">
        <Card title="库存预警" :loading="loading" class="alert-table">
          <template #extra>
            <Button type="link" @click="() => {}">
              <template #icon><FilterOutlined /></template>
              筛选
            </Button>
          </template>
          <Table
            :columns="stockAlertColumns"
            :data-source="stockAlertData"
            :pagination="{ pageSize: 5 }"
            size="middle"
          />
        </Card>
      </Col>
      
      <!-- 库位使用率 -->
      <Col :xs="24" :lg="8">
        <Card title="库位使用率" :loading="loading" class="location-usage">
          <div v-for="(item, index) in locationUsageData" :key="index" class="usage-item">
            <div class="usage-info">
              <span class="name">{{ item.name }}</span>
              <span class="value">{{ item.usage }}%</span>
            </div>
            <Progress 
              :percent="item.usage" 
              :stroke-color="item.color" 
              :status="item.usage > 80 ? 'exception' : 'normal'"
            />
          </div>
        </Card>
      </Col>
    </Row>
    
    <!-- 货物分类占比 -->
    <Row :gutter="16" class="chart-row">
      <Col :span="24">
        <Card title="货物分类占比" :loading="loading" class="category-chart">
          <div class="category-wrapper">
            <div v-for="(item, index) in categoryData" :key="index" class="category-item">
              <div class="category-bar">
                <div class="category-progress" :style="{width: `${item.value}%`, backgroundColor: item.color}"></div>
              </div>
              <div class="category-info">
                <span class="category-label">
                  <span class="category-dot" :style="{backgroundColor: item.color}"></span>
                  {{ item.name }}
                </span>
                <span class="category-value">{{ item.value }}%</span>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
    
    <!-- 最近操作记录 -->
    <Card class="recent-table" :loading="loading">
      <Tabs v-model:activeKey="activeTabKey">
        <TabPane key="1" tab="最近入库记录">
          <Table
            :columns="recentInboundColumns"
            :data-source="recentInboundData"
            :pagination="{ pageSize: 5 }"
            size="middle"
          />
        </TabPane>
        <TabPane key="2" tab="最近出库记录">
          <Table
            :columns="recentInboundColumns"
            :data-source="recentOutboundData"
            :pagination="{ pageSize: 5 }"
            size="middle"
          />
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  .page-header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .left {
      h2 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      
      p {
        color: rgba(0, 0, 0, 0.45);
        margin: 0;
      }
    }
  }
  
  .stats-row {
    margin-bottom: 24px;
  }
  
  .stat-change {
    display: flex;
    align-items: center;
    margin-top: 8px;
    font-size: 14px;
    
    span {
      margin-left: 4px;
    }
    
    .change-text {
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
    }
  }
  
  .chart-row {
    margin-bottom: 24px;
  }
  
  .recent-table {
    margin-bottom: 24px;
  }
  
  .location-usage {
    .usage-item {
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .usage-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        
        .name {
          color: rgba(0, 0, 0, 0.65);
        }
        
        .value {
          font-weight: 500;
        }
      }
    }
  }
  
  .category-chart {
    .category-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .category-item {
      display: flex;
      flex-direction: column;
      
      .category-bar {
        width: 100%;
        height: 16px;
        background-color: #f0f0f0;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 4px;
        
        .category-progress {
          height: 100%;
          border-radius: 8px;
        }
      }
      
      .category-info {
        display: flex;
        justify-content: space-between;
        
        .category-label {
          display: flex;
          align-items: center;
          
          .category-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
          }
        }
        
        .category-value {
          font-weight: 500;
        }
      }
    }
  }
  
  /* 响应式样式 */
  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      
      .right {
        margin-top: 16px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style> 
