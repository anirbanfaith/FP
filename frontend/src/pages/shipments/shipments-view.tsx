import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/shipments/shipmentsSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const ShipmentsView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { shipments } = useAppSelector((state) => state.shipments)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View shipments')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View shipments')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/shipments/shipments-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>TrackingID</p>
                    <p>{shipments?.tracking_id}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Seller</p>

                        <p>{shipments?.seller?.name ?? 'No data'}</p>

                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Courier</p>

                        <p>{shipments?.courier?.name ?? 'No data'}</p>

                </div>

                <FormField label='PickupDate'>
                    {shipments.pickup_date ? <DatePicker
                      dateFormat="yyyy-MM-dd hh:mm"
                      showTimeSelect
                      selected={shipments.pickup_date ?
                        new Date(
                          dayjs(shipments.pickup_date).format('YYYY-MM-DD hh:mm'),
                        ) : null
                      }
                      disabled
                    /> : <p>No PickupDate</p>}
                </FormField>

                <FormField label='DeliveryDate'>
                    {shipments.delivery_date ? <DatePicker
                      dateFormat="yyyy-MM-dd hh:mm"
                      showTimeSelect
                      selected={shipments.delivery_date ?
                        new Date(
                          dayjs(shipments.delivery_date).format('YYYY-MM-DD hh:mm'),
                        ) : null
                      }
                      disabled
                    /> : <p>No DeliveryDate</p>}
                </FormField>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Status</p>
                    <p>{shipments?.status ?? 'No data'}</p>
                </div>

                <>
                    <p className={'block font-bold mb-2'}>Support_tickets Shipment</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>IssueType</th>

                                <th>Description</th>

                                <th>ReportedAt</th>

                            </tr>
                            </thead>
                            <tbody>
                            {shipments.support_tickets_shipment && Array.isArray(shipments.support_tickets_shipment) &&
                              shipments.support_tickets_shipment.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/support_tickets/support_tickets-view/?id=${item.id}`)}>

                                    <td data-label="issue_type">
                                        { item.issue_type }
                                    </td>

                                    <td data-label="description">
                                        { item.description }
                                    </td>

                                    <td data-label="reported_at">
                                        { dataFormatter.dateTimeFormatter(item.reported_at) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!shipments?.support_tickets_shipment?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/shipments/shipments-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

ShipmentsView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default ShipmentsView;
