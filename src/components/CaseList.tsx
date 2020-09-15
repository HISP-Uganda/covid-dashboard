import { Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';

export const CaseList = () => {

  const [visible, setVisible] = useState(false)

  const showModal = () => {
    setVisible(true)
  };

  const handleOk = (e: any) => {
    setVisible(false)
  };

  const handleCancel = (e: any) => {
    setVisible(false);
  };

  return <div>
    <Button size="large" onClick={showModal}>
      View Cases
    </Button>
    <Modal
      width="80%"
      bodyStyle={{ minHeight: '70vh', display: 'flex', alignContent: 'center', alignItems: 'center', marginLeft: '45%', fontSize: '20px' }}
      title="Case List"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Coming soon...</p>
    </Modal>
  </div>
}
