import React, { FC, useEffect } from "react";
import { observer } from "mobx-react";
import { TItem } from "../../models/Visualization";
import { useStore } from "../../Context";
import Marquee from "react-marquee-slider";
import { Spinner } from '../Spinner'



interface SingleValuesProps {
  element: TItem;
}

export const TVValues: FC<SingleValuesProps> = observer(({ element }) => {
  const store = useStore();

  useEffect(() => {
    element.setOu([store.selectedOrgUnit]);
    element.fetchFromAnalytics();
    setInterval(() => {
      element.setOu([store.selectedOrgUnit]);
      element.fetchFromAnalytics(false);
    }, store.refreshRate)
  }, [element, store.selectedOrgUnit, store.refreshRate]);

  if (element.loading) {
    return <Spinner />;
  }


  return (
    <div className="px-2">
      <Marquee velocity={72} direction="rtl" debug={false} onFinish={() => { console.log('Finished') }} resetAfterTries={200} scatterRandomly={false} >
        {Object.values(element.chart).map((value: any, i: number) => (
          <div key={value.dx} style={{ fontSize: 28, marginLeft: 20, marginRight: 20 }}>
            <span style={{ marginRight: 8 }}>{value.label}</span>
            <span style={{ color: '#1b3a50', fontWeight: 'bolder' }}>{value.value}{value.otherText}</span>
          </div>
        ))}
      </Marquee>
    </div>

  );
});
