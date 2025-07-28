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

import { update, fetch } from '../../stores/support_tickets/support_ticketsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditSupport_tickets = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'issue_type': '',

    shipment: null,

    description: '',

    reported_at: new Date(),

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { support_tickets } = useAppSelector((state) => state.support_tickets)

  const { support_ticketsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: support_ticketsId }))
  }, [support_ticketsId])

  useEffect(() => {
    if (typeof support_tickets === 'object') {
      setInitialValues(support_tickets)
    }
  }, [support_tickets])

  useEffect(() => {
      if (typeof support_tickets === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (support_tickets)[el])

          setInitialValues(newInitialVal);
      }
  }, [support_tickets])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: support_ticketsId, data }))
    await router.push('/support_tickets/support_tickets-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit support_tickets')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit support_tickets'} main>
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
        label="IssueType"
    >
        <Field
            name="issue_type"
            placeholder="IssueType"
        />
    </FormField>

    <FormField label='Shipment' labelFor='shipment'>
        <Field
            name='shipment'
            id='shipment'
            component={SelectField}
            options={initialValues.shipment}
            itemRef={'shipments'}

            showField={'tracking_id'}

        ></Field>
    </FormField>

    <FormField label="Description" hasTextareaHeight>
        <Field name="description" as="textarea" placeholder="Description" />
    </FormField>

      <FormField
          label="ReportedAt"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.reported_at ?
                  new Date(
                      dayjs(initialValues.reported_at).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'reported_at': date})}
          />
      </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/support_tickets/support_tickets-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditSupport_tickets.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditSupport_tickets
