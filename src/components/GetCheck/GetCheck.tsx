import {
  ChangeEventHandler,
  FormEvent,
  HTMLInputTypeAttribute,
  useEffect,
  useId,
  useState,
} from 'react';
import { useRouter } from 'next/router';

import AppHead from '../AppHead/AppHead';
import styles from './GetCheck.module.css';
import AppTitle from '../AppTitle/AppTitle';
import AppKeywords from '../AppKeywords/AppKeywords';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import AppDescription from '../AppDescription/AppDescription';
import FetchOrders from '@/utils/FetchBackend/rest/api/order';
import AppContainer from '@/components/AppContainer/AppContainer';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';
import SendCheckDto from '@/utils/FetchBackend/rest/api/order/dto/send-check.dto';

export default function GetCheck() {
  const route = useRouter();
  const { orderId } = route.query;
  const [data, setData] = useState<SendCheckDto>({
    dp_bank: '',
    dp_bik: '',
    dp_checkingAccount: '',
  });
  const [modal, setModal] = useState(<></>);

  useEffect(() => {
    const jBank = localStorage.getItem('dp_check_bank');
    const jBik = localStorage.getItem('dp_check_bik');
    const jCheckingAccount = localStorage.getItem('dp_check_checkingAccount');

    setData({
      dp_bank: jBank ? jBank : '',
      dp_bik: jBik ? jBik : '',
      dp_checkingAccount: jCheckingAccount ? jCheckingAccount : '',
    });
  }, []);

  async function sendCheck() {
    try {
      const response: boolean = await FetchOrders.sendCheck(data, `${orderId}`);
      if (response) {
        localStorage.setItem('dp_check_bank', data.dp_bank);
        localStorage.setItem('dp_check_bik', data.dp_bik);
        localStorage.setItem(
          'dp_check_checkingAccount',
          data.dp_checkingAccount,
        );

        alert('Документ "счёт-фактура" отправлен на почту');

        route.push('/user-profile/orders');
      }
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception);
    }
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendCheck();
  }

  const SEO_TITLE = 'Отправка документа "Счёт-фактура" на электронную почту';
  const SEO_DESCRIPTION =
    'Отправка документа "Счёт-фактура" на электронную почту';
  const SEO_KEYWORDS = 'Отправка документа "Счёт-фактура" на электронную почту';

  function handleChangeCheckindAccount(value: string) {
    setData({ ...data, dp_checkingAccount: value });
  }

  function handleChangeBank(value: string) {
    setData({ ...data, dp_bank: value });
  }

  function handleChangeBik(value: string) {
    setData({ ...data, dp_bik: value });
  }

  return (
    <AppWrapper>
      {modal}
      <AppTitle title={SEO_TITLE} />
      <AppDescription description={SEO_DESCRIPTION} />
      <AppKeywords keywords={SEO_KEYWORDS} />
      <AppHead />
      <Breadcrumbs />
      <AppContainer>
        <h2>{SEO_TITLE}</h2>
        <div className={styles.wrapper}>
          <form onSubmit={handleFormSubmit}>
            <FormInputView label="Заявка" value={`${orderId}`} />
            <FormInput
              type="text"
              label="Расчётный счёт"
              placeholder="Расчетный счёт"
              value={data.dp_checkingAccount}
              onChange={event =>
                handleChangeCheckindAccount(event.target.value)
              }
            />
            <FormInput
              type="text"
              label="Банк"
              placeholder="Банк"
              value={data.dp_bank}
              onChange={event => handleChangeBank(event.target.value)}
            />
            <FormInput
              type="text"
              label="БИК"
              placeholder="БИК"
              value={data.dp_bik}
              onChange={event => handleChangeBik(event.target.value)}
            />
            <button>Отправить на почту</button>
          </form>
        </div>
      </AppContainer>
    </AppWrapper>
  );
}

interface IFormInput {
  type?: HTMLInputTypeAttribute | undefined;
  placeholder?: string | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
  label?: string | undefined;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  maxLength?: number | undefined;
  min?: number | undefined;
  name?: string | undefined;
}

function FormInput(props: IFormInput) {
  const id = useId();

  return (
    <>
      {props.label ? <label htmlFor={id}>{props.label}</label> : null}
      <input
        type={props.type}
        id={id}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        maxLength={props.maxLength}
        min={props.min}
      />
    </>
  );
}

interface IFormInputView {
  value: string;
  label: string;
}

function FormInputView(props: IFormInputView) {
  const id = useId();

  return (
    <>
      {props.label ? <label htmlFor={id}>{props.label}</label> : null}
      <span>{props.value}</span>
    </>
  );
}
