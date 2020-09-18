import { observable, action, computed } from "mobx";
import { flatten } from "lodash";
import { TDashboard, Dashboard } from "./models/Dashboard";
import axios from "axios";
import { BASE_URL } from "./utils/uid";
import React from 'react';

const baseUrl = BASE_URL;
class Store {
  @observable currentDashboard: TDashboard = new Dashboard();
  @observable d2: any;
  @observable userOrgUnits: any = [];
  @observable selectedOrgUnit: any;
  @observable isLight: boolean = false;
  @observable refreshRate = 200000;
  @observable isInDhis2 = true;
  @observable currentInstances = {
    columns: [],
    rows: []
  }


  @action setD2 = async (d2: any) => (this.d2 = d2);
  @action setIsLight = (val: boolean) => this.isLight = val;
  @action setCurrentInstances = (val: any) => this.currentInstances = val;
  @action
  loadUserOrgUnits = async () => {
    const api = this.d2.Api.getApi();
    try {
      if (this.isInDhis2) {
        const { organisationUnits } = await api.get("me.json", {
          fields: "organisationUnits[id,path,name,level,leaf,displayShortName~rename(displayName),children::isNotEmpty]"
        });
        this.userOrgUnits = organisationUnits;

      } else {
        const { data: { organisationUnits } } = await axios.get(`${baseUrl}/query`, {
          params: {
            path: 'me.json',
            fields: "organisationUnits[id,path,name,level,leaf,displayShortName~rename(displayName),children::isNotEmpty]",
          }
        });
        this.userOrgUnits = organisationUnits;
      }
      this.selectedOrgUnit = this.userOrgUnits[0].id;
    } catch (e) {
      console.log(e);
    }
  };

  @action
  loadOrganisationUnitsChildren = async (parent: string) => {
    try {

      if (this.isInDhis2) {
        const api = this.d2.Api.getApi();

        const { organisationUnits } = await api.get("organisationUnits.json", {
          filter: `id:in:[${parent}]`,
          paging: "false",
          fields: "children[id,name,path,leaf]",
        });

        const found = organisationUnits.map((unit: any) => {
          return unit.children.map((child: any) => {
            return { ...child, pId: parent };
          });
        });
        const all = flatten(found);
        this.userOrgUnits = [...this.userOrgUnits, ...all];
      } else {
        const { data: { data: { organisationUnits } } } = await axios.get(`${baseUrl}/query`, {
          params: {
            path: 'organisationUnits.json',
            filter: `id:in:[${parent}]`,
            paging: "false",
            fields: "children[id,name,path,leaf]",
          }
        });
        const found = organisationUnits.map((unit: any) => {
          return unit.children.map((child: any) => {
            return { ...child, pId: parent };
          });
        });
        const all = flatten(found);
        this.userOrgUnits = [...this.userOrgUnits, ...all];
      }

    } catch (e) {
      console.log(e);
    }
  };

  @action setSelectedOrgUnit = (val: any) => {
    this.selectedOrgUnit = val;
  };

  @action createDashboard = () => {
    const dashboard = new Dashboard();
    dashboard.setD2(this.d2);
    this.currentDashboard = dashboard;
  };

  @action loadInstances = async (ou: string) => {
    const api = this.d2.Api.getApi();
    const { headers, rows } = await api.get("trackedEntityInstances/query.json", {
      ou,
      ouMode: 'SELECTED',
      order: 'created:desc',
      program: 'HfsajBhUM5l',
      programStatus: 'ACTIVE',
      paging: "false"
    });

    const columns = headers.map((a: any, i: number) => {
      return {
        key: a.name,
        title: a.column,
        dataIndex: a.name,
        render: (text: string, row: any) => {
          return <div>{row[i]}</div>
        }
      }
    }).filter((s: any) => ['OXW58q5OIi7', 'FZzQbW8AWVd', 'XvETY1aTxuB', 'rZH6sV93ALm'].indexOf(s.key) !== -1)
    this.setCurrentInstances({
      columns,
      rows
    })
  };


  @computed
  get organisationUnits() {
    const units = this.userOrgUnits.map((unit: any) => {
      return {
        id: unit.id,
        pId: unit.pId || "",
        value: unit.id,
        title: unit.name,
        isLeaf: unit.leaf,
      };
    });
    return units;
  }

  @computed get currentBackgrounds() {
    if (!this.isLight) {
      return {
        background: 'bg-black',
        cardBG: 'bg-gray-800',
        header: 'tab-header-black',
        indicatorLabel: '',

      }
    }

    return {
      background: 'light',
      cardBG: 'card-bg',
      header: 'tab-header',
    }
  }
}

export const store = new Store();
