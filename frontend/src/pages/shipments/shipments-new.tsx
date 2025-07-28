import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement } from 'react'
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
import { SwitchField } from '../../components/SwitchField'

import { SelectField } from '../../components/SelectField'
import {RichTextField} from "../../components/RichTextField";

import { create } from '../../stores/shipments/shipmentsSlice'
import { useAppDispatch } from '../../stores/hooks'
import { useRouter } from 'next/router'

const initialValues = {

    tracking_id: '',

    seller: '',

    courier: '',

    pickup_date: '',

    delivery_date: '',

    status: 'Pending',

}

const ShipmentsNew = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleSubmit = async (data) => {
    await dispatch(create(data))
    await router.push('/shipments/shipments-list')
  }
  return (
    <>
      <Head>
        <title>{getPageTitle('New Item')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="New Item" main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            initialValues={
                initialValues
            }
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

  <FormField label="Seller" labelFor="seller">
      <Field name="seller" id="seller" component={SelectField} options={[]} itemRef={'sellers'}></Field>
  </FormField>

  <FormField label="Courier" labelFor="courier">
      <Field name="courier" id="courier" component={SelectField} options={[]} itemRef={'couriers'}></Field>
  </FormField>

  <FormField
      label="PickupDate"
  >
      <Field
          type="datetime-local"
          name="pickup_date"
          placeholder="PickupDate"
      />
  </FormField>

  <FormField
      label="DeliveryDate"
  >
      <Field
          type="datetime-local"
          name="delivery_date"
          placeholder="DeliveryDate"
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

ShipmentsNew.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default ShipmentsNew
