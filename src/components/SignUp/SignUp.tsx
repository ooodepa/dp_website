import {
  ChangeEventHandler,
  FormEvent,
  HTMLInputTypeAttribute,
  useEffect,
  useId,
  useState,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './SignUp.module.css';
import AppHead from '../AppHead/AppHead';
import AppTitle from '../AppTitle/AppTitle';
import AppModal from '../AppModal/AppModal';
import AppWrapper from '../AppWrapper/AppWrapper';
import AppKeywords from '../AppKeywords/AppKeywords';
import AppContainer from '../AppContainer/AppContainer';
import FetchUsers from '@/utils/FetchBackend/rest/api/users';
import AppDescription from '../AppDescription/AppDescription';
import HttpException from '@/utils/FetchBackend/HttpException';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';
import FetchUnp from '@/utils/FetchBackend/rest/api/portal-nalog-gov-by';
import CreateUserDto from '@/utils/FetchBackend/rest/api/users/dto/create-user.dto';

export default function SignUp() {
  const route = useRouter();
  const [data, setData] = useState<CreateUserDto>({
    dp_address: '',
    dp_email: '',
    dp_firstName: '',
    dp_lastName: '',
    dp_login: '',
    dp_middleName: '',
    dp_nameLegalEntity: '',
    dp_password: '',
    dp_receptionPhone: '+',
    dp_shortNameLegalEntity: '',
    dp_unp: '',
  });
  const [modal, setModal] = useState(<></>);
  const [step, setStep] = useState(1);
  const minStep = 1;
  const maxStep = 4;

  const SEO_TITLE = 'Регистрация';
  const SEO_DESCRIPTION = 'Регистрация';
  const SEO_KEYWORDS = 'Регистрация';

  function plusStep() {
    if (step + 1 > maxStep) {
      setStep(maxStep);
      return;
    }
    setStep(step + 1);
  }

  function minusStep() {
    if (step - 1 <= minStep) {
      setStep(minStep);
      return;
    }
    setStep(step - 1);
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  useEffect(() => {
    async function registration() {
      if (step === 2) {
        if (data.dp_unp.length < 9) {
          setModal(
            <AppModal
              title="Регистрация (ошибка ввода)"
              message="УНП не может содержать меньше 9 цифр">
              <button onClick={() => setModal(<></>)}>Закрыть</button>
            </AppModal>,
          );
          setStep(1);
          return;
        }

        if (isNaN(Number(data.dp_unp))) {
          setModal(
            <AppModal
              title="Регистрация (ошибка ввода)"
              message="УНП состоит только из цифр">
              <button onClick={() => setModal(<></>)}>Закрыть</button>
            </AppModal>,
          );
          setStep(1);
          return;
        }

        try {
          const json = await FetchUnp.get(data.dp_unp);
          setData({
            ...data,
            dp_address: json?.row?.vpadres ? json.row.vpadres : '',
            dp_nameLegalEntity: json?.row?.vnaimp ? json.row.vnaimp : '',
            dp_shortNameLegalEntity: json?.row?.vnaimk ? json.row.vnaimk : '',
          });
        } catch (exception) {
          if (
            exception instanceof HttpException &&
            exception.HTTP_STATUS === 404
          ) {
            setModal(
              <AppModal
                title="Регистрация (ошибка ввода)"
                message="Такой УНП не найден">
                <button onClick={() => setModal(<></>)}>Закрыть</button>
              </AppModal>,
            );
            setStep(1);
            return;
          }
          await AsyncAlertExceptionHelper(exception);
        }

        return;
      }
      if (step === 4) {
        if (data.dp_receptionPhone.length !== 13) {
          setModal(
            <AppModal
              title="Регистрация (ошибка ввода)"
              message="Телефон указан не в международном формате (+375aabbbccdd)">
              <button onClick={() => setModal(<></>)}>Закрыть</button>
            </AppModal>,
          );
          setStep(3);
          return;
        }
        if (data.dp_lastName.length === 0) {
          setModal(
            <AppModal
              title="Регистрация (ошибка ввода)"
              message="Фамилия не указана">
              <button onClick={() => setModal(<></>)}>Закрыть</button>
            </AppModal>,
          );
          setStep(3);
          return;
        }
        if (data.dp_firstName.length === 0) {
          setModal(
            <AppModal
              title="Регистрация (ошибка ввода)"
              message="Имя не указано">
              <button onClick={() => setModal(<></>)}>Закрыть</button>
            </AppModal>,
          );
          setStep(3);
          return;
        }
      }
    }
    registration();
  }, [step]);

  function handleChangeUnp(unp: string) {
    let number = Number(unp);
    setData({ ...data, dp_unp: `${number}` });
  }

  function handleChangePhone(phone: string) {
    let number = Number(phone);
    if (phone[0] === '+' && !isNaN(number)) {
      setData({ ...data, dp_receptionPhone: `+${number}` });
      return;
    }

    number = Number(phone.substring(1));
    if (!isNaN(number)) {
      setData({ ...data, dp_receptionPhone: `+${number}` });
      return;
    }

    setData({ ...data, dp_receptionPhone: '+' });
    return;
  }

  function handleChangeShortName(shortName: string) {
    setData({ ...data, dp_shortNameLegalEntity: shortName });
  }

  function handleChangeName(name: string) {
    setData({ ...data, dp_nameLegalEntity: name });
  }

  function handleChangeAddress(address: string) {
    setData({ ...data, dp_address: address });
  }

  function handleChangeLastname(lastname: string) {
    setData({ ...data, dp_lastName: lastname });
  }

  function handleChangeFirstname(firstname: string) {
    setData({ ...data, dp_firstName: firstname });
  }

  function handleChangeMiddlename(middlename: string) {
    setData({ ...data, dp_middleName: middlename });
  }

  function handleChangeLogin(login: string) {
    setData({ ...data, dp_login: login });
  }

  function handleChangeEmail(email: string) {
    setData({ ...data, dp_email: email });
  }

  function handleChangePassword(password: string) {
    setData({ ...data, dp_password: password });
  }

  async function submit() {
    try {
      const isCreated = await FetchUsers.create(data);
      if (isCreated) {
        route.push('/user-profile');
      }
    } catch (exception) {
      if (exception instanceof HttpException && exception.HTTP_STATUS === 400) {
        try {
          const response = exception.RESPONSE;
          const json = await response.json();
          setModal(
            <AppModal title="Регистрация (ошибка ввода)" message={json.message}>
              <button onClick={() => setModal(<></>)}>Закрыть</button>
            </AppModal>,
          );
          return;
        } catch (e) {}
      }

      await AsyncAlertExceptionHelper(exception);
    }
  }

  return (
    <AppWrapper>
      {modal}
      <AppTitle title={SEO_TITLE} />
      <AppDescription description={SEO_DESCRIPTION} />
      <AppKeywords keywords={SEO_KEYWORDS} />
      <AppHead />
      <AppContainer>
        <h2>
          Регистрация {step} / {maxStep}
        </h2>
        <div className={styles.wrapper}>
          <form action="" onSubmit={handleFormSubmit}>
            {step === 1 ? (
              <>
                <FormInput
                  name="dp_unp"
                  type="number"
                  label="УНП"
                  placeholder="Введите ваш УНП"
                  value={data.dp_unp}
                  onChange={event => handleChangeUnp(event.target.value)}
                  maxLength={32}
                  min={0}
                />
              </>
            ) : step === 2 ? (
              <>
                <FormInput
                  label="Краткое наименование"
                  value={data.dp_shortNameLegalEntity}
                  onChange={event => handleChangeShortName(event.target.value)}
                />
                <FormInput
                  label="Наименование"
                  value={data.dp_nameLegalEntity}
                  onChange={event => handleChangeName(event.target.value)}
                />
                <FormInput
                  label="Адрес"
                  value={data.dp_address}
                  onChange={event => handleChangeAddress(event.target.value)}
                />
              </>
            ) : step === 3 ? (
              <>
                <FormInput
                  name="dp_receptionPhone"
                  label="Телефон приёмной"
                  value={data.dp_receptionPhone}
                  onChange={event => handleChangePhone(event.target.value)}
                  maxLength={13}
                />
                <FormInput
                  name="dp_lastName"
                  label="Фамилия"
                  value={data.dp_lastName}
                  onChange={event => handleChangeLastname(event.target.value)}
                  maxLength={24}
                />
                <FormInput
                  name="dp_firstName"
                  label="Имя"
                  value={data.dp_firstName}
                  onChange={event => handleChangeFirstname(event.target.value)}
                  maxLength={24}
                />
                <FormInput
                  name="dp_middleName"
                  label="Отчество"
                  value={data.dp_middleName}
                  onChange={event => handleChangeMiddlename(event.target.value)}
                  maxLength={24}
                />
              </>
            ) : step === 4 ? (
              <>
                <FormInput
                  name="dp_login"
                  label="Логин"
                  value={data.dp_login}
                  onChange={event => handleChangeLogin(event.target.value)}
                  maxLength={64}
                />
                <FormInput
                  name="dp_email"
                  label="E-mail"
                  type="email"
                  value={data.dp_email}
                  onChange={event => handleChangeEmail(event.target.value)}
                  maxLength={64}
                />
                <FormInput
                  name="dp_password"
                  label="Пароль"
                  type="password"
                  value={data.dp_password}
                  onChange={event => handleChangePassword(event.target.value)}
                />
              </>
            ) : null}
            {step <= minStep ? (
              <div className={styles.many_buttons}>
                <button onClick={minusStep} disabled={true}>
                  Назад
                </button>
                <button onClick={plusStep}>Далее</button>
              </div>
            ) : step > maxStep ? (
              <div className={styles.many_buttons}>
                <button onClick={minusStep}>Назад</button>
                <button onClick={plusStep} disabled={true}>
                  Далее
                </button>
              </div>
            ) : step === maxStep ? (
              <div className={styles.many_buttons}>
                <button onClick={minusStep}>Назад</button>
                <button onClick={submit}>Зарегистрироваться</button>
              </div>
            ) : (
              <div className={styles.many_buttons}>
                <button onClick={minusStep}>Назад</button>
                <button onClick={plusStep}>Далее</button>
              </div>
            )}
            <Link href="/user-profile/sign-in">У меня есть аккаунт</Link>
            <Link href={`${process.env.NEXT_PUBLIC__ANDROID_APP}`}>
              Скачать моб. приложение
            </Link>
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
