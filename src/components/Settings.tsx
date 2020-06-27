import { SettingOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Modal } from 'antd'
export const Settings = observer(() => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true)
  }
  const handleOk = (e: any) => {
    setVisible(false)
  }
  const handleCancel = (e: any) => {
    setVisible(false)
  }
  return <div>
    <SettingOutlined style={{ fontSize: '24px', color: 'white', marginRight: 20, }} onClick={showModal} />
    <Modal
      title="Basic Modal"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Settings Coming soon</p>
    </Modal>
  </div>;
});