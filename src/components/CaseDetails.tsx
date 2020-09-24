
import { Descriptions, Table, Tabs } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { observer } from 'mobx-react';
import React, { FC, useState } from 'react';
import { useStore } from '../Context';
import { Spinner } from './Spinner';

interface CaseListProps {
  instance: string,
  label: string
}

const { TabPane } = Tabs;

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
      width="98%"
      bodyStyle={{ height: '78vh', overflow: 'auto' }}
      destroyOnClose={true}
      title="Case Details"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {loading ? <Spinner /> : <div>
        <Descriptions title="Demographic Information" bordered className="">
          {store.report.attributes.map((a: any) => <Descriptions.Item key={a.attribute} label={a.displayName}><span className="text-blue-400">{a.value}</span></Descriptions.Item>)}
        </Descriptions>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Case Investigation" key="1">
            <Table dataSource={store.report.transposedEvents[0].rows} rowKey="name" columns={store.report.transposedEvents[0].columns} pagination={false} />
          </TabPane>
          <TabPane tab="Contact before Illiness" key="2">
            <Table dataSource={store.report.transposedEvents[1].rows} rowKey="name" columns={store.report.transposedEvents[1].columns} pagination={false} />
          </TabPane>
          <TabPane tab="Outcomes" key="3">
            <Table dataSource={store.report.transposedEvents[2].rows} rowKey="name" columns={store.report.transposedEvents[2].columns} pagination={false} />
          </TabPane>
        </Tabs>
      </div>}
    </Modal>
  </div>
});
