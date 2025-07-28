import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/sellers/sellersSlice'
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

const SellersView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { sellers } = useAppSelector((state) => state.sellers)

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
              <title>{getPageTitle('View sellers')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View sellers')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/sellers/sellers-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Name</p>
                    <p>{sellers?.name}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Email</p>
                    <p>{sellers?.email}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>PhoneNumber</p>
                    <p>{sellers?.phone_number}</p>
                </div>

                <>
                    <p className={'block font-bold mb-2'}>Shipments Seller</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>TrackingID</th>

                                <th>PickupDate</th>

                                <th>DeliveryDate</th>

                                <th>Status</th>

                            </tr>
                            </thead>
                            <tbody>
                            {sellers.shipments_seller && Array.isArray(sellers.shipments_seller) &&
                              sellers.shipments_seller.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/shipments/shipments-view/?id=${item.id}`)}>

                                    <td data-label="tracking_id">
                                        { item.tracking_id }
                                    </td>

                                    <td data-label="pickup_date">
                                        { dataFormatter.dateTimeFormatter(item.pickup_date) }
                                    </td>

                                    <td data-label="delivery_date">
                                        { dataFormatter.dateTimeFormatter(item.delivery_date) }
                                    </td>

                                    <td data-label="status">
                                        { item.status }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!sellers?.shipments_seller?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/sellers/sellers-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

SellersView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default SellersView;
