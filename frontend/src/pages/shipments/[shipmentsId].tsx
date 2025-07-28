import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/shipments/shipmentsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditShipments = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'tracking_id': '',

    seller: null,

    courier: null,

    pickup_date: new Date(),

    delivery_date: new Date(),

    status: '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { shipments } = useAppSelector((state) => state.shipments)

  const { shipmentsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: shipmentsId }))
  }, [shipmentsId])

  useEffect(() => {
    if (typeof shipments === 'object') {
      setInitialValues(shipments)
    }
  }, [shipments])

  useEffect(() => {
      if (typeof shipments === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (shipments)[el])

          setInitialValues(newInitialVal);
      }
  }, [shipments])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: shipmentsId, data }))
    await router.push('/shipments/shipments-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit shipments')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit shipments'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="TrackingID"
    >
        <Field
            name="tracking_id"
            placeholder="TrackingID"
        />
    </FormField>

    <FormField label='Seller' labelFor='seller'>
        <Field
            name='seller'
            id='seller'
            component={SelectField}
            options={initialValues.seller}
            itemRef={'sellers'}

            showField={'name'}

        ></Field>
    </FormField>

    <FormField label='Courier' labelFor='courier'>
        <Field
            name='courier'
            id='courier'
            component={SelectField}
            options={initialValues.courier}
            itemRef={'couriers'}

            showField={'name'}

        ></Field>
    </FormField>

      <FormField
          label="PickupDate"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.pickup_date ?
                  new Date(
                      dayjs(initialValues.pickup_date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'pickup_date': date})}
          />
      </FormField>

      <FormField
          label="DeliveryDate"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.delivery_date ?
                  new Date(
                      dayjs(initialValues.delivery_date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'delivery_date': date})}
          />
      </FormField>

    <FormField label="Status" labelFor="status">
        <Field name="status" id="status" component="select">

            <option value="Pending">Pending</option>

            <option value="InTransit">InTransit</option>

            <option value="Delivered">Delivered</option>

            <option value="Cancelled">Cancelled</option>

        </Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/shipments/shipments-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditShipments.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditShipments
