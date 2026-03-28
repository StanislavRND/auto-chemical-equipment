import { ScrollToTop } from "@shared/lib/hooks/ScrollToTop";
import { Button } from "@shared/ui/Button/Button";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./PrivacyPolicyPage.module.scss";

export const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.wrapper}>
      <ScrollToTop />
      <div className={styles.container}>
        <ShieldCheck className={styles.icon} size={64} />

        <h1 className={styles.title}>Политика конфиденциальности</h1>

        <div className={styles.message}>
          <p>
            Настоящая Политика конфиденциальности описывает, какие данные
            собирает и обрабатывает интернет-магазин «ОптовикАвтоХим»,
            занимающийся оптовой продажей автохимии и оборудования, а также цели
            и способы их использования.
          </p>
        </div>

        <div className={styles.content}>
          <article className={styles.block}>
            <h2 className={styles.subtitle}>1. Общие положения</h2>
            <ul className={styles.list}>
              <li>
                1.1. Настоящая Политика конфиденциальности определяет порядок
                обработки и защиты персональных данных пользователей
                интернет-магазина «ОптовикАвтоХим».
              </li>
              <li>
                1.2. Использование сайта означает согласие пользователя с данной
                Политикой и условиями обработки его персональных данных.
              </li>
              <li>
                1.3. В случае несогласия с условиями Политики пользователь
                должен прекратить использование сайта.
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>2. Какие данные мы собираем</h2>
            <ul className={styles.list}>
              <li>
                2.1. Персональные данные, предоставляемые пользователем: ФИО,
                адрес электронной почты.
              </li>
              <li>
                2.2. Данные компании: наименование организации, ИНН, КПП, адрес.
              </li>
              <li>2.3. Информация о доставке: ФИО, номер телефона.</li>
              <li>
                2.4. Технические данные: IP-адрес, данные cookies, информация о
                браузере и устройстве.
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>
              3. Цели обработки персональных данных
            </h2>
            <ul className={styles.list}>
              <li>
                3.1. Регистрация пользователя и предоставление доступа к личному
                кабинету.
              </li>
              <li>
                3.2. Обработка и выполнение заказов на автохимию и оборудование.
              </li>
              <li>
                3.3. Связь с клиентом по вопросам заказов, доставки и оплаты.
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>
              4. Передача данных третьим лицам
            </h2>
            <ul className={styles.list}>
              <li>
                4.1. Персональные данные могут передаваться службам доставки для
                выполнения заказов.
              </li>
              <li>
                4.2. Платежным сервисам — в случае использования онлайн-оплаты.
              </li>
              <li>
                4.3. Государственным органам — в случаях, предусмотренных
                законодательством.
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>5. Использование cookies</h2>
            <ul className={styles.list}>
              <li>
                5.1. Сайт использует cookies для корректной работы, аналитики и
                улучшения пользовательского опыта.
              </li>
              <li>
                5.2. Пользователь может отключить cookies в настройках своего
                браузера.
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>6. Сроки хранения данных</h2>
            <ul className={styles.list}>
              <li>
                6.1. Персональные данные хранятся в течение срока, необходимого
                для достижения целей обработки.
              </li>
              <li>
                6.2. По запросу пользователя данные могут быть удалены, если
                иное не предусмотрено законодательством.
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>7. Права пользователя</h2>
            <ul className={styles.list}>
              <li>
                7.1. Пользователь имеет право на получение информации о своих
                персональных данных.
              </li>
              <li>
                7.2. Пользователь вправе требовать исправления или удаления
                своих данных.
              </li>
              <li>
                7.3. Пользователь может отозвать согласие на обработку
                персональных данных, направив запрос по контактам, указанным
                ниже.
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>8. Контактная информация</h2>
            <ul className={styles.list}>
              <li>8.1. Email: test@gmail.com</li>
              <li>8.2. Телефон: +7 (800) 535-77-77</li>
              <li>
                8.3. Индивидуальный предприниматель Холоднов Павел Львович , ИНН
                610205663700, ОГРНИП 318619600146272
              </li>
            </ul>
          </article>
        </div>

        <div className={styles.buttons}>
          <Button
            onClick={() => navigate("/")}
            variant="primary"
            className={styles.btn}
          >
            На главную
          </Button>

          <Button
            className={styles.btn}
            onClick={() => navigate(-1)}
            variant="outline"
          >
            Назад
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
