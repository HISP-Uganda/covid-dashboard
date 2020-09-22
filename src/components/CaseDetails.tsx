import { Table } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { observer } from 'mobx-react';
import React, { FC, useState } from 'react';
import { useStore } from '../Context';
import { Spinner } from './Spinner';


interface CaseListProps {
  instance: string,
  label: string
}

export const CaseDetails: FC<CaseListProps> = observer(({ instance, label }) => {
  const store = useStore()
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const showModal = async () => {
    setLoading(true);
    setVisible(true);
    await store.loadInstance(instance);
    setLoading(false);
  };

  const handleOk = (e: any) => {
    setVisible(false);
  };

  const handleCancel = (e: any) => {
    setVisible(false);
  };

  return <div>
    <div onClick={showModal}>
      {label}
    </div>
    <Modal
      width="80%"
      bodyStyle={{ height: '60vh', overflow: 'auto' }}
      title="Case Details"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {loading ? <Spinner /> : <div>
        {store.report.map((report: any, i: number) => <Table key={i} dataSource={report.rows} rowKey="name" columns={report.columns} pagination={false} />)}
      </div>}
    </Modal>
  </div>
});
