import { Button, Table, Input } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { observer } from 'mobx-react';
import React, { FC, useState } from 'react';
import { useStore } from '../Context';
import { Spinner } from './Spinner';

const { Search } = Input;

interface CaseListProps {
  ou: any
}

export const CaseList: FC<CaseListProps> = observer(({ ou }) => {
  const store = useStore()
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const showModal = async () => {
    setLoading(true);
    setVisible(true);
    store.setCurrentOu(ou);
    await store.loadInstances();
    setLoading(false);
  };

  const handleOk = (e: any) => {
    setVisible(false);
    store.setCurrentInstances({ columns: [], rows: [] })
  };

  const handleCancel = (e: any) => {
    setVisible(false);
    store.setCurrentInstances({ columns: [], rows: [] })
  };

  return <div>
    <Button size="large" onClick={showModal}>
      View Cases
    </Button>
    <Modal
      width="90%"
      bodyStyle={{ height: '70vh', overflow: 'auto' }}
      title="Case List"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {loading ? <Spinner /> : <div>
        <div style={{ textAlign: 'right', marginBottom: 10 }}>
          <Search
            size="large"
            placeholder="search text"
            onSearch={store.onSearch}
            style={{ width: 400 }}
          />
        </div>
        <Table
          rowKey="instance"
          columns={store.currentInstances.columns}
          dataSource={store.currentInstances.rows}
          rowClassName={() => "cursor-pointer"}
          onChange={store.handleChange}
          pagination={{
            showSizeChanger: true,
            total: store.total,
            pageSize: store.pageSize,
            showQuickJumper: true,
            current: store.page,
            pageSizeOptions: ["5", "10", "15", "20", "25", "50", "100"],
          }} />
      </div>}
    </Modal>
  </div>
});
