<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Card, Col, Row, Statistic, Table } from 'ant-design-vue';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue';

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
  }
];

const recentInboundData = ref([
  {
    key: '1',
    orderNo: 'IN202404020001',
    productName: '智能手表 A1',
    quantity: 100,
    inboundTime: '2024-04-02 08:30:12',
    operator: '张三'
  },
  {
    key: '2',
    orderNo: 'IN202404020002',
    productName: '无线耳机 B2',
    quantity: 200,
    inboundTime: '2024-04-02 09:15:27',
    operator: '李四'
  },
  {
    key: '3',
    orderNo: 'IN202404020003',
    productName: '智能手机 C3',
    quantity: 50,
    inboundTime: '2024-04-02 10:05:43',
    operator: '王五'
  },
  {
    key: '4',
    orderNo: 'IN202404020004',
    productName: '平板电脑 D4',
    quantity: 30,
    inboundTime: '2024-04-02 11:22:18',
    operator: '赵六'
  },
  {
    key: '5',
    orderNo: 'IN202404020005',
    productName: '蓝牙音箱 E5',
    quantity: 80,
    inboundTime: '2024-04-02 13:45:32',
    operator: '钱七'
  }
]);

// 加载数据
onMounted(() => {
  // 模拟API请求获取数据
  console.log('Dashboard mounted, fetching data...');
});
</script>

<template>
  <div class="dashboard-container">
    <div class="page-header">
      <h2>仪表盘</h2>
      <p>欢迎使用IMLJX智能仓储管理系统</p>
    </div>
    
    <!-- 统计卡片 -->
    <Row :gutter="[16, 16]" class="stats-row">
      <Col :span="6" v-for="(stat, index) in statsData" :key="index">
        <Card hoverable>
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
            </div>
          </template>
        </Card>
      </Col>
    </Row>
    
    <!-- 最近入库记录 -->
    <Card title="最近入库记录" class="recent-table">
      <Table
        :columns="recentInboundColumns"
        :data-source="recentInboundData"
        :pagination="{ pageSize: 5 }"
      />
    </Card>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  .page-header {
    margin-bottom: 24px;
    
    h2 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    p {
      color: rgba(0, 0, 0, 0.45);
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
  }
  
  .recent-table {
    margin-bottom: 24px;
  }
}
</style> 
