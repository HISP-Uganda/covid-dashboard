import { Button, Table } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { observer } from 'mobx-react';
import React, { FC, useState } from 'react';
import { useStore } from '../Context';
import { Spinner } from './Spinner';

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
    await store.loadInstances(ou);
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
      width="80%"
      bodyStyle={{ minHeight: '70vh', overflow: 'auto' }}
      title="Case List"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {loading ? <Spinner /> : <Table columns={store.currentInstances.columns} dataSource={store.currentInstances.rows} />}
    </Modal>
  </div>
});
