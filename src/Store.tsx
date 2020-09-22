import { observable, action, computed } from "mobx";
import { flatten, fromPairs, groupBy } from "lodash";
import { TDashboard, Dashboard } from "./models/Dashboard";
import axios from "axios";
import { BASE_URL } from "./utils/uid";
import React from "react";
import { CaseDetails } from "./components/CaseDetails";

const baseUrl = BASE_URL;
class Store {
  @observable currentDashboard: TDashboard = new Dashboard();
  @observable d2: any;
  @observable userOrgUnits: any = [];
  @observable userPrograms: any = [];
  @observable selectedOrgUnit: any;
  @observable isLight: boolean = false;
  @observable refreshRate = 200000;
  @observable currentOu: string = '';
  @observable page = 1;
  @observable total = 0;
  @observable pageSize = 10;
  @observable query = "";
  sorter = "created:desc";
  @observable isInDhis2 = true;
  @observable currentInstances = {
    columns: [],
    rows: []
  };
  @observable currentInstance: any;
  @observable programDetails: any;

  @action setD2 = async (d2: any) => (this.d2 = d2);
  @action setIsLight = (val: boolean) => this.isLight = val;
  @action setCurrentInstances = (val: any) => this.currentInstances = val;
  @action setCurrentInstance = (val: any) => this.currentInstance = val;
  @action setCurrentOu = (val: any) => this.currentOu = val;
  @action setProgramDetails = (val: any) => this.programDetails = val;
  @action
  loadUserOrgUnits = async () => {
    const api = this.d2.Api.getApi();
    try {
      const { organisationUnits, programs } = await api.get("me.json", {
        fields: "programs,organisationUnits[id,path,name,level,leaf,displayShortName~rename(displayName),children::isNotEmpty]"
      });
      const programDetails = await api.get('programs/HfsajBhUM5l.json', { fields: 'programStages[id,name,programStageDataElements[id,dataElement[id,name]]]' });
      this.setProgramDetails(programDetails);
      this.userOrgUnits = organisationUnits;
      this.userPrograms = programs;
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

  @action loadInstances = async () => {
    const api = this.d2.Api.getApi();
    const { rows, headers, metaData: { pager: { page, pageSize, total } } } = await api.get("trackedEntityInstances/query.json", this.params);
    this.pageSize = pageSize;
    this.total = total;
    this.page = page;

    // const rows: any = trackedEntityInstances.map(({ attributes, enrollments, trackedEntityInstance }: any) => {
    //   let status = 'Active'
    //   const searchEnrollments = enrollments.find(({ program }: any) => program === 'HfsajBhUM5l');
    //   if (searchEnrollments) {
    //     const outComeEvent = searchEnrollments.events.find(({ programStage }: any) => programStage === 'swHvUzVHpYL');
    //     if (outComeEvent) {
    //       const discharged = outComeEvent.dataValues.find(({ dataElement }: any) => dataElement === 'xGUYkoLv0oN');
    //       if (discharged) {
    //         status = discharged.value;
    //       }
    //     }
    //   }
    //   return {
    //     trackedEntityInstance,
    //     status,
    //     ...fromPairs(attributes.map(({ attribute, value }: any) => {
    //       return [attribute, value]
    //     }))
    //   }
    // });



    const trackedEntityInstances = rows.map((r: any) => {
      const currentParams = {
        trackedEntityInstance: r[0],
        programStage: 'swHvUzVHpYL',
        dataElement: 'xGUYkoLv0oN',
        orgUnit: this.currentOu,
        paging: false,
        pageSize: 1
      }
      return api.get('events.json', currentParams);
    })

    const instances = await Promise.all(trackedEntityInstances);

    let processedInstances: any = instances.map((instance: any) => {
      let status = 'Active'
      const { trackedEntityInstance, dataValues } = instance.events[0];
      const discharged = dataValues.find(({ dataElement }: any) => dataElement === 'xGUYkoLv0oN');
      if (discharged) {
        status = discharged.value;
      }

      return [trackedEntityInstance, status];
    });

    processedInstances = fromPairs(processedInstances)

    const currentRows = rows.map((r: any) => {
      let results = Object.assign.apply(
        {},
        headers.map((v: any, i: number) => ({
          [v['name']]: r[i],
        }))
      );
      results = { ...results, status: processedInstances[r[0]] }
      return results;
    });


    // const columns = [
    //   { id: 'OXW58q5OIi7', title: 'CV19-Unique ID' },
    //   { id: 'sB1IHYu2xQT', title: 'Full Name' },
    //   { id: 'FZzQbW8AWVd', title: 'Sex' },
    //   { id: 'XvETY1aTxuB', title: 'Nationality' },
    //   { id: 'rZH6sV93ALm', title: 'Phone' },
    //   { id: 'status', title: 'Status' }
    // ].map((a: any, i: number) => {
    //   return {
    //     key: a.id,
    //     title: a.title,
    //     dataIndex: a.id
    //   }
    // })

    const columns = [...headers, { name: 'status', column: 'Status' }].filter((h: any) => {
      return [
        'OXW58q5OIi7',
        'sB1IHYu2xQT',
        'FZzQbW8AWVd',
        'XvETY1aTxuB',
        'rZH6sV93ALm',
        'status'
      ].indexOf(h.name) !== -1
    })
      .map((a: any) => {
        return {
          key: a.name,
          title: a.column,
          dataIndex: a.name,
          sorter: a.name !== 'status',
          render: (text: string, row: any) => {
            return <CaseDetails label={row[a.name]} instance={row['instance']} />;
          },
        };
      })

    this.setCurrentInstances({
      columns,
      rows: currentRows
    })
  };

  @action onSearch = async (value: string, e: any) => {
    this.query = value;
    await this.loadInstances();
  }

  @action handleChange = async (pagination: any, filters: any, sorter: any) => {
    const order =
      sorter.field && sorter.order
        ? `${sorter.field}:${sorter.order === "ascend" ? "asc" : "desc"}`
        : "created:desc";
    const page =
      pagination.pageSize !== this.pageSize || order !== this.sorter
        ? 1
        : pagination.current;
    this.sorter = order;
    this.page = page;
    this.pageSize = pagination.pageSize;
    await this.loadInstances();
  };

  @action loadInstance = async (instance: string) => {
    const api = this.d2.Api.getApi();
    this.currentInstance = await api.get(`trackedEntityInstances/${instance}.json`, { fields: '*' })
  }


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

  @computed get canSeeViewButton() {
    return this.userPrograms.indexOf('HfsajBhUM5l') !== -1
  }

  @computed get params() {
    let parameters: any = {
      ou: this.currentOu,
      page: this.page,
      totalPages: true,
      ouMode: 'SELECTED',
      program: 'HfsajBhUM5l',
      programStatus: 'ACTIVE',
      pageSize: this.pageSize,
      order: this.sorter,
      fields: '*'
    }

    if (this.query !== "") {
      parameters = { ...parameters, query: `LIKE:${this.query}` };
    }
    return parameters
  }

  @computed get report() {
    if (this.programDetails && this.currentInstance) {
      const { events } = this.currentInstance.enrollments[0];
      return this.programDetails.programStages.map((programStage: any) => {
        const stageData = groupBy(events.filter((e: any) => e.programStage === programStage.id), 'eventDate');
        return {
          rows: programStage.programStageDataElements.map((psde: any) => {
            const vals = Object.entries(stageData).map((v: any) => {
              const [k, value] = v;
              let current = '';
              if (value) {
                const dataValue = value[0].dataValues.find((de: any) => de.dataElement === psde.dataElement.id);
                if (dataValue) {
                  current = dataValue.value
                }
              }
              return [k, current]
            });
            return { name: psde.dataElement.name, ...fromPairs(vals) }
          }),
          columns: [{
            key: 'name',
            title: 'Data Element',
            dataIndex: 'name'
          }, ...Object.keys(stageData).map((k: any) => {
            return {
              key: k,
              title: k,
              dataIndex: k
            }
          })]
        }
      })
    }
    return []
  }
}

export const store = new Store();
