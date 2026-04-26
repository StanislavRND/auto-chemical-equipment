import { ScrollToTop } from "@shared/lib/hooks/ScrollToTop";
import { Button } from "@shared/ui/Button/Button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./UserAgreementPage.module.scss";

const UserAgreementPage = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.wrapper}>
      <ScrollToTop />

      <div className={styles.container}>
        <FileText className={styles.icon} size={64} />

        <h1 className={styles.title}>Пользовательское соглашение</h1>

        <div className={styles.message}>
          <p>
            Настоящее Пользовательское соглашение регулирует порядок
            использования сайта интернет-магазина «ОптовикАвтоХим», а также
            условия оформления и выполнения оптовых заказов автохимии и
            оборудования.
          </p>
        </div>

        <div className={styles.content}>
          <article className={styles.block}>
            <h2 className={styles.subtitle}>1. Термины и общие положения</h2>
            <ul className={styles.list}>
              <li>
                1.1. Администрация сайта — лицо, осуществляющее управление
                сайтом и предоставляющее сервисы интернет-магазина
                «ОптовикАвтоХим».
              </li>
              <li>
                1.2. Пользователь — любое лицо, которое посещает сайт и/или
                оформляет заказ, регистрируется и использует функционал сайта.
              </li>
              <li>
                1.3. Используя сайт, пользователь подтверждает, что ознакомился
                с условиями настоящего Соглашения и принимает их.
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>2. Регистрация и личный кабинет</h2>
            <ul className={styles.list}>
              <li>
                2.1. Для использования отдельных функций сайта пользователь
                может пройти регистрацию и просмотреть личный кабинет.
              </li>
              <li>
                2.2. Пользователь обязуется предоставлять достоверные данные при
                регистрации и оформлении заказа.
              </li>
              <li>
                2.3. Пользователь несёт ответственность за сохранность данных
                доступа к своему аккаунту.
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>3. Оформление заказа</h2>
            <ul className={styles.list}>
              <li>
                3.1. Информация о товарах, ценах и наличии на сайте носит
                справочный характер и может обновляться.
              </li>
              <li>
                3.2. Оформляя заказ, пользователь подтверждает намерение купить
                выбранные товары на условиях, указанных на сайте.
              </li>
              <li>
                3.3. Администрация сайта вправе уточнять детали заказа по
                телефону или email.
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>4. Оплата и доставка</h2>
            <ul className={styles.list}>
              <li>
                4.1. Способы оплаты и условия оплаты указываются на сайте и/или
                согласуются с пользователем при оформлении заказа.
              </li>
              <li>
                4.2. Доставка осуществляется доступными способами, указанными на
                сайте, и в согласованные сроки.
              </li>
              <li>
                4.3. Риск случайной гибели/повреждения товара переходит к
                пользователю с момента передачи товара службе доставки либо
                получения товара пользователем (в зависимости от способа).
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>5. Возврат и рекламации</h2>
            <ul className={styles.list}>
              <li>
                5.1. Порядок возврата и обмена товара определяется действующим
                законодательством и правилами, размещёнными на сайте (при
                наличии).
              </li>
              <li>
                5.2. Претензии по качеству/комплектации принимаются в разумный
                срок после получения товара, с приложением фото/описания
                проблемы.
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>6. Ограничение ответственности</h2>
            <ul className={styles.list}>
              <li>
                6.1. Администрация сайта не несёт ответственности за временные
                сбои и перерывы в работе сайта, вызванные техническими
                причинами.
              </li>
              <li>
                6.2. Администрация сайта не несёт ответственности за действия
                третьих лиц (служб доставки, платёжных провайдеров), если услуги
                оказываются ими независимо.
              </li>
              <li>
                6.3. Пользователь обязуется использовать информацию на сайте
                добросовестно и не нарушать права третьих лиц.
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>7. Персональные данные</h2>
            <ul className={styles.list}>
              <li>
                7.1. Обработка персональных данных осуществляется в соответствии
                с Политикой конфиденциальности, размещённой на сайте.
              </li>
              <li>
                7.2. Пользователь даёт согласие на обработку персональных данных
                в целях выполнения заказов и связи по вопросам обслуживания.
              </li>
            </ul>
          </article>

          <article className={styles.block}>
            <h2 className={styles.subtitle}>8. Контакты</h2>
            <ul className={styles.list}>
              <li>8.1. Email: optovikautohim@mail.ru</li>
              <li>
                8.3. Индивидуальный предприниматель Холоднов Павел Львович, ИНН
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

export default UserAgreementPage;
