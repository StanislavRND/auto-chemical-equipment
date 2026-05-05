--
-- PostgreSQL database dump
--

\restrict TVxg770CVToUnHFCbeoAqCM5Cp4PNcvsaGKVJvH7ea9jdE6RQViMdKP7MDu0s90

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg13+1)
-- Dumped by pg_dump version 18.3 (Debian 18.3-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    article character varying(50) NOT NULL,
    name character varying NOT NULL,
    image_url character varying NOT NULL,
    price double precision NOT NULL,
    qty integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    discount_percent double precision,
    category_id integer NOT NULL
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_id_seq OWNER TO postgres;

--
-- Name: cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    image_url character varying,
    rating integer
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.codes (
    email character varying NOT NULL,
    code_hash character varying NOT NULL,
    expires_at timestamp with time zone NOT NULL
);


ALTER TABLE public.codes OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    number_order character varying(6) NOT NULL,
    user_id integer,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    middle_name character varying(100),
    comment text,
    products json NOT NULL,
    total_products_count integer NOT NULL,
    total_price numeric(10,2) NOT NULL,
    status character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    category_id integer,
    subcategory_id integer,
    article character varying(6) NOT NULL,
    name character varying NOT NULL,
    image_url character varying NOT NULL,
    description text,
    compound text NOT NULL,
    method_of_application text NOT NULL,
    existence boolean NOT NULL,
    price double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    discount_percent integer
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: subcategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subcategories (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    category_id integer
);


ALTER TABLE public.subcategories OWNER TO postgres;

--
-- Name: subcategories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subcategories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subcategories_id_seq OWNER TO postgres;

--
-- Name: subcategories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subcategories_id_seq OWNED BY public.subcategories.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    role character varying NOT NULL,
    hashed_password character varying NOT NULL,
    inn character varying,
    kpp character varying,
    legal_address character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    legal_name character varying,
    user_type character varying NOT NULL,
    full_name character varying,
    phone character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cart id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: subcategories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories ALTER COLUMN id SET DEFAULT nextval('public.subcategories_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
581a4d2c8d06
\.


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, user_id, product_id, article, name, image_url, price, qty, created_at, discount_percent, category_id) FROM stdin;
59	36	63	000033	Complex Tutela Воск для быстрой сушки кузова с ароматом Bubble gum, 5 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/35174ccdd730429293f69ccf99300117.webp	3220	4	2026-04-28 09:07:30.325678+00	0	60
61	38	32	000002	Активная пена Active Foam Balance, 5л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/4872b2e39b3c435d9ec563b888e2679c.webp	630	22	2026-04-29 09:03:12.301328+00	0	60
64	38	60	000030	Холодный воск (концентрат) AVS AVK-708, 0.5 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/41283b26414b41128d241973a6a38206.webp	410	15	2026-04-29 09:06:16.057608+00	0	60
65	38	66	000036	AVS Чернитель шин Концентрат, 5 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/6a432b8efd144e52a2e055915344ede0.webp	1500	10	2026-05-03 07:21:09.241402+00	0	66
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, created_at, image_url, rating) FROM stdin;
61	Оборудование для автомойки	2026-04-27 11:47:52.571415+00	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/categories/2e4dffa2f9d547c1a0e6cde78a9e1f3f.webp	0
67	Лакокрасочные материалы	2026-04-27 13:06:12.032555+00	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/categories/cb96c3e2328a4223a1dc69b697f7a47e.webp	1
66	Для дисков и шин	2026-04-27 13:04:31.492984+00	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/categories/a3b693f81ac8422f907cab1b0c167fe0.webp	0
62	Масла и технические жидкости	2026-04-27 12:51:40.385873+00	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/categories/06d0428131584aa89dbf20f7747f7228.webp	0
63	Клеи и герметики	2026-04-27 12:59:58.206581+00	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/categories/413089add94c40208bfef1e8e7efc6e2.webp	1
69	Сервисные средства	2026-04-27 13:10:18.364545+00	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/categories/21a2e7eaac04436a9ab4f935cbc5ff35.webp	0
60	Автокосметика	2026-04-27 10:44:05.409454+00	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/categories/631dbc5d85154a5189d39bbe2936e752.webp	2
\.


--
-- Data for Name: codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.codes (email, code_hash, expires_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, number_order, user_id, first_name, last_name, middle_name, comment, products, total_products_count, total_price, status, created_at) FROM stdin;
38	100	36	Станислав	Синельников	Евгеньевич	\N	[{"product_id": 30, "name": "\\u044b\\u0432\\u043f", "article": "000002", "image_url": "https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/283835c20576428cbbaa9f30383d939a.webp", "quantity": 6, "price": 1993.0, "total_price": 11958.0}]	6	11958.00	pending	2026-04-26 13:32:34.457701+00
39	101	36	Станислав	Синельников	Евгеньевич	\N	[{"product_id": 31, "name": "\\u0410\\u0432\\u0442\\u043e\\u0448\\u0430\\u043c\\u043f\\u0443\\u043d\\u044c \\u0434\\u043b\\u044f \\u0431/\\u043a \\u043c\\u043e\\u0439\\u043a\\u0438 AVS \\"Active Foam\\", 1 \\u043b.", "article": "000001", "image_url": "https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/c551972af0a44009a3271f885b73a06b.webp", "quantity": 1, "price": 428.0, "total_price": 428.0}, {"product_id": 34, "name": "\\u0428\\u0430\\u043c\\u043f\\u0443\\u043d\\u044c \\u0434\\u043b\\u044f \\u0433\\u0440\\u0443\\u0437\\u043e\\u0432\\u043e\\u0433\\u043e \\u0430\\u0432\\u0442\\u043e \\u0434\\u0432\\u0443\\u0445\\u043a\\u043e\\u043c\\u043f\\u043e\\u043d\\u0435\\u043d\\u0442\\u043d\\u044b\\u0439, 6 \\u043a\\u0433.", "article": "000004", "image_url": "https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/c2eb1a4ef4244e719ec9864cb875f5c5.webp", "quantity": 5, "price": 2070.0, "total_price": 10350.0}]	6	10778.00	pending	2026-04-27 15:23:43.053722+00
40	102	36	Тест	Тест	Тест	\N	[{"product_id": 59, "name": "\\u041b\\u0430\\u043a \\u0430\\u043a\\u0440\\u0438\\u043b\\u043e\\u0432\\u044b\\u0439 \\u043f\\u0440\\u043e\\u0437\\u0440\\u0430\\u0447\\u043d\\u044b\\u0439 ClearCoat Premium, 520 \\u043c\\u043b", "article": "000029", "image_url": "https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/8160e288eb5b46489a2e0f569732d686.webp", "quantity": 8, "price": 1350.0, "total_price": 10800.0}]	8	10800.00	pending	2026-04-28 08:42:28.556539+00
41	103	36	Тест	Тест	Тест	\N	[{"product_id": 68, "name": "\\u0413\\u0435\\u0440\\u043c\\u0435\\u0442\\u0438\\u043a \\u0434\\u043b\\u044f \\u0444\\u043e\\u0440\\u043c\\u0438\\u0440\\u043e\\u0432\\u0430\\u043d\\u0438\\u044f \\u043f\\u0440\\u043e\\u043a\\u043b\\u0430\\u0434\\u043e\\u043a AXIOM \\u0432\\u044b\\u0441\\u043e\\u043a\\u043e\\u0442\\u0435\\u043c\\u043f\\u0435\\u0440\\u0430\\u0442\\u0443\\u0440\\u043d\\u044b\\u0439, \\u0447\\u0435\\u0440\\u043d\\u044b\\u0439 ASK147, 0.28 \\u043b.", "article": "000038", "image_url": "https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/ead3c5cc049d49978694732ada64172f.webp", "quantity": 11, "price": 990.0, "total_price": 10890.0}]	11	10890.00	pending	2026-04-28 08:53:44.499336+00
42	104	36	Тест	Тест	Тест	\N	[{"product_id": 63, "name": "Complex Tutela \\u0412\\u043e\\u0441\\u043a \\u0434\\u043b\\u044f \\u0431\\u044b\\u0441\\u0442\\u0440\\u043e\\u0439 \\u0441\\u0443\\u0448\\u043a\\u0438 \\u043a\\u0443\\u0437\\u043e\\u0432\\u0430 \\u0441 \\u0430\\u0440\\u043e\\u043c\\u0430\\u0442\\u043e\\u043c Bubble gum, 5 \\u043b.", "article": "000033", "image_url": "https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/35174ccdd730429293f69ccf99300117.webp", "quantity": 4, "price": 3220.0, "total_price": 12880.0}]	4	12880.00	pending	2026-04-28 09:07:46.231482+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, category_id, subcategory_id, article, name, image_url, description, compound, method_of_application, existence, price, created_at, discount_percent) FROM stdin;
31	60	86	000001	Автошампунь для б/к мойки AVS "Active Foam", 1 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/c551972af0a44009a3271f885b73a06b.webp	Двухкомпонентный (двухфазный) автошампунь очищает поверхности от солевых отложений, от органических и неорганических жирных пятен, подтеков и маслянистых загрязнений. Обладает высоким пенообразованием и сильным чистящим эффектом. Благодаря рецептуре автошампунь не теряет своих чистящих свойств даже в воде с высоким содержанием солей. Легко смывается водой и не обладает выраженным запахом. Не оставляет разводов.	аПАВ 5-15%, нПАВ ≥5%, гидроксид натрия ≤5%, комплекообразователи ≤10%, органические растворители ≤5%, функциональные добавки ≤5%, очищенная вода ≥30%.	Перед нанесением необходимо взболтать до однородной эмульсии.\nПенокомплект: 90-125 г из расчета разбавления водой 1:7-10, в зависимости от степени загрязнения.\nПеногенератор: (25, 50, 100л) 10-15 г из расчета разбавления водой 1:90-120, в зависимости от степени загрязнения.\nСбить с поверхности рыхлый слой грязи и нанести разбавленный состав снизу вверх для избежания подтеков. Выдержать 1-2 минуты, не допуская высыхания. Смыть водой под высоким давлением.\nСредний расход на одну легковую машину составляет 40-60 г.	t	450	2026-04-27 10:46:35.425299+00	5
32	60	86	000002	Активная пена Active Foam Balance, 5л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/4872b2e39b3c435d9ec563b888e2679c.webp	Активная пена Active Foam Balance в канистре объёмом 5 кг — это концентрированный автошампунь, предназначенный для бесконтактной мойки легковых автомобилей. Благодаря высокоэффективной формуле, включающей 30 % очищенной воды, анионные и неионогенные поверхностно‑активные вещества, а также комплексные добавки в виде соли эдта и гидроксида натрия, средство обеспечивает глубокое удаление загрязнений, не повреждая лакокрасочное покрытие.	Вода, Оксиэтилидендифосфоновая кислота, Натр Едкий, Альфа Олефин Сульфонат Натрия, Трилон Б 4-Na,\nНеонол 9-12, Лаурет Сульфат Натрия, Бутилдигликоль, Окись Амина Твалам 24, Отдушка, краситель.	Перед нанесением средство необходимо разбавить с водой из расчета 1:1-1:2 (300-500 г) в пенокомплект (1л) или 1:20-1:30 (30-50 г/л) для пеногенератора (25,50,100 л), в зависимости от степени загрязнения. Остудить кузов автомобиля. При необходимости сбить верхний слой грязи, после чего нанести разбавленный состав снизу вверх, чтобы избежать подтеков. Выдержать 1-2 мин. не допуская высыхания! Тщательно смыть водой под высоким давлением с близкого расстояния (15-20 см) снизу вверх.	t	630	2026-04-27 10:49:35.118625+00	0
34	60	86	000004	Шампунь для грузового авто двухкомпонентный, 6 кг.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/c2eb1a4ef4244e719ec9864cb875f5c5.webp	Шампунь для грузового авто двухкомпонентный 6кг active foam truck grass - это высококачественное средство для ухода за грузовыми автомобилями. Продукт от известного бренда GraSS, который зарекомендовал себя на рынке автохимии благодаря своей надежности и эффективности.\nДвухкомпонентная формула шампуня обеспечивает глубокое очищение и уход за кузовом автомобиля. Благодаря этому, автомобиль будет выглядеть как новый, а также будет защищен от коррозии и других повреждений.\nШампунь обладает высокой моющей способностью, что позволяет быстро и эффективно удалять грязь, масло, соли и другие загрязнения.\nПродукт имеет удобную упаковку весом 6 кг, что позволяет использовать его на протяжении длительного времени.\nВ целом, шампунь для грузового авто двухкомпонентный 6кг active foam truck grass от GraSS - это надежный и эффективный выбор для тех, кто ценит качество и заботится о своем автомобиле.	≥ 30% вода, ≥ 5%, но <15% анионные ПАВ, неионогенные ПАВ, соль ЭДТА, гидроксид натрия, органический растворитель, краситель.	Использовать только после разбавления (пенокомплект 1:1–1:3, пеногенератор 1:30–1:70).	t	2300	2026-04-27 11:03:33.343602+00	10
33	60	86	000003	Активный шампунь для бесконтактной мойки ActiveGel, 5 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/1dd5a7d3a115419eb0e00912e9741cfd.webp	Безфосфатный низкощелочной гель предназначен для бесконтактной мойки автотранспорта на автоматизированных и ручных автомоечных предприятиях. Специальная рецептура ActiveGel позволяет легко отмывать даже самые стойкие загрязнения с кузова автомобиля, при этом не повреждая поверхность ЛКП и другие материалы экстерьера. Особая композиция ПАВ и комплексообразователей обеспечивает стабильность работы состава даже при использовании воды с кратным превышением ПДК по солям жесткости и металлам. pH 12	Вода; композиция комплексообразователей; гидроксид натрия; Композиция анионных и неионогенных ПАВ; краситель.	После разбавления водой нанести на поверхность и выдержать 2-3 минуты. Не допускать высыхания на поверхности! Тщательно смыть напором воды.	t	1400	2026-04-27 10:59:07.977596+00	0
35	60	86	000005	Активный шампунь для бесконтактной мойки EuroWash SS937, 5 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/afd796a106414d3e84dde9553cfbe641.webp	Новейшая разработка для предварительной мойки автомобиля по технологии Shine Systems обеспечивает европейский уровень качества и безопасности ухода за кузовом автомобиля. Благодаря уникальной композиции ПАВ и комплексонов европейского производства состав эффективно удаляет с поверхности кузова все типы неустойчивых загрязнений за один подход при этом не повреждая ЛКП, хром, пластик и другие материалы экстерьера. Рекомендуется для применения в качестве первой фазы при многоэтапной мойке автомобиля, а также для применения на автоматических портальных и туннельных мойках. ph 12.	Комплексообразователь; неионогенные пав; красители; анионные пав; вода; гидроксид натрия.	После разбавления водой нанести на поверхность и выдержать 2-3 минуты. Не допускать высыхания на поверхности! Тщательно смыть напором воды.	t	2500	2026-04-27 11:05:22.785558+00	0
39	62	\N	000009	LHM Plus жидкость гидравлическая минеральная, 5 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/933436362db0457681de4da9c9debaa6.webp	Жидкость гидравлическая Comma LHM Plus - это улучшенное минеральное масло с высокими эксплуатационными характеристиками, специально разработанное для гидросистем автомобилей, требующих жидкости на минеральной основе.	Синтетическое; гидравлическое.	Используется в гидравлических тормозных системах, системах гидроусилителя руля, гидропневматических подвесках и гидравлических муфтах сцепления в определенных моделях автомобилей Citroën, Peugeot, где компоненты системы окрашены в зеленый цвет.	t	4300	2026-04-27 11:21:25.795532+00	0
40	62	\N	000010	Трансмиссионная жидкость Kixx CVTF, 1 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/d07fbee8e4d9427d8f519a5a8b4c2f03.webp	Синтетическая жидкость для бесступенчатых трансмиссий. ОПИСАНИЕ. Синтетическая трансмиссионная жидкость премиум-класса. Предназначена для технического обслуживания большинства автомобилей, оснащенных бесступенчатыми трансмиссиями (CVT). Эта жидкость (CVTF) специально разработана для обеспечения комфортного вождения, увеличения срока службы трансмиссий, увеличения интервалов обслуживания, отличной защиты от износа ременных и цепных приводов. Она рекомендуется для использования во всех бесступенчатых трансмиссиях с ременным и цепным приводом.	Полностью синтетическая трансмиссионная жидкость (100% синтетика).	Жидкость предназначена исключительно для бесступенчатых трансмиссий (CVT) клиноременного типа. Замена должна производиться в соответствии с регламентом технического обслуживания автомобиля (обычно каждые 40-60 тыс. км). Перед применением обязательно сверьтесь с руководством по эксплуатации вашего автомобиля и убедитесь, что требуется жидкость со спецификациями, аналогичными оригинальным маслам: Toyota CVTF TC/FE, Nissan NS-1/NS-2/NS-3, Mitsubishi CVTF-J1/J4, Honda HMMF/HCF-2 (кроме некоторых моделей с требованием Ultra HMMF), Subaru CV-30/CV-45, Suzuki CVTF 3320/ Green 1, Mazda CVTF 3320, Hyundai/Kia CVTF (SP-CVT 1), Daihatsu CVTF, а также некоторые жидкости Ford, GM и BMW с пометкой CVT. Для замены потребуется 1 литр (частичная замена) или 5-8 литров (полная замена на оборудовании). Процесс замены включает: прогрев коробки до рабочей температуры, слив старой жидкости через сливную пробку, замену сливного кольца, заправку новой жидкости через щуп или заливное отверстие, затем прогрев и контроль уровня. Проводить замену рекомендуется на специализированном СТО с использованием аппарата для полной замены ATF/CVT. Не смешивать с другими типами жидкостей (ATF для гидромеханических автоматов) и маслами для вариаторов других цветов (зелеными, желтыми) без полной промывки системы.	t	1200	2026-04-27 11:26:47.204537+00	0
36	60	86	000006	Активный шампунь для бесконтактной мойки SuperStar SS925, 0.9 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/1bc1f820cd3e44fb9abb3b23a62defcf.webp	Суперконцентрированное средство на основе европейских ПАВов последнего поколения, предназначенное для мойки автотранспорта бесконтактным способом. Благодаря повышенной многокомпонентности состав обеспечивает максимальную эффективность работы даже в самых экстремальных случаях, великолепно справляясь с большим диапазоном типов загрязнений. Обладая предельными значениями концентрации активных веществ гарантирует экономичность и максимальный результат. pH 12.	Комплексообразователь; неионогенные пав; красители; анионные пав; вода; гидроксид натрия	После разбавления водой нанести на поверхность и выдержать 2-3 минуты. Не допускать высыхания на поверхности! Тщательно смыть напором воды.	t	330	2026-04-27 11:08:18.44767+00	0
41	62	\N	000011	Масло трансмиссионное ATF для АКПП TYPE T-IV  TOYOTA, 0.946 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/64b60f0cb55c4ac9a90cc06917983708.webp	Трансмиссионное масло Toyota ATF Type T-IV, 0.946 л – это оригинальная полностью синтетическая жидкость красного цвета, разработанная инженерами Toyota специально для автоматических коробок передач более ранних моделей автомобилей Toyota, Lexus и Scion, выпущенных преимущественно до 2005 года.	Изготавливается на основе высококачественных синтетических базовых масел (включая ПАО) и сбалансированного пакета присадок.	ажно: данное масло не рекомендуется использовать в трансмиссиях, рассчитанных на Dexron II/III или Type T, а также в современных АКПП, требующих жидкость спецификации Toyota WS (World Standard) . Рекомендуемая периодичность замены: частичная замена (слив и долив) каждые 30-40 тысяч километров пробега, полная замена со снятием поддона, очисткой магнитов и заменой фильтра – каждые 80-120 тысяч километров . При эксплуатации автомобиля в тяжелых условиях (частые поездки по городу в пробках, буксировка прицепа, агрессивный стиль вождения) интервалы замены следует сократить . Процесс частичной замены (для АКПП, оснащенных сливной пробкой) включает: прогрев коробки до рабочей температуры, слив старой жидкости через сливное отверстие, замену уплотнительного кольца сливной пробки, заливку свежего масла через заливную горловину или щуп АКПП в объеме, соответствующем слитому (частичная замена обычно требует 3.5-4.0 литра жидкости) . После заливки необходимо прогреть автомобиль, последовательно переключить все режимы селектора АКПП с задержкой на несколько секунд в каждом положении, после чего проверить уровень масла на щупе (на прогретой коробке, при работающем двигателе на ровной поверхности) – уровень должен находиться между метками "HOT" или в пределах зоны "COLD" в зависимости от инструкции.	t	1155	2026-04-27 11:32:27.591653+00	0
43	61	88	000013	Держатель автомобильного коврика зубчатый, настенный	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/7998acd3a330429a8c1dabb86ac4ddcc.webp	Держатель автомобильного коврика с зубчатым захватом, настенный, нерж. cталь AISI 304	Нерж. cталь AISI 304.Нерж. cталь AISI 304.	Закрепите основание держателя на стене в удобном месте с помощью  фурнитуры.	t	1190	2026-04-27 11:58:12.625284+00	0
44	61	88	000014	Кронштейн для турбосушки	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/3581bb6a9a09420b9784f3e5089e66f5.webp	Металлический кронштейн для крепления турбосушки на стене.	Металл.	Выберите подходящее место на стене с учетом длины шланга и удобства доступа к обрабатываемой поверхности, затем закрепите основание кронштейна с помощью анкерных болтов или саморезов, в зависимости от материала стены (бетон, кирпич, гипсокартон).	t	3100	2026-04-27 12:00:31.086875+00	0
42	61	88	000012	Насадка для турбосушки плоская широкая	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/e24d2f91e95f48db847696bc2619e326.webp	Насадка для турбосушки плоская широкая, подходит для двухтурбинной турбосушки BY-1090C.	Пластик.	Наденьте плоскую широкую насадку на сопло турбосушки (фена для авто), убедившись в надежной фиксации	t	95	2026-04-27 11:54:20.691576+00	0
45	61	88	000015	Щетка для химчистки	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/2da9d0828d89444993f6673505880114.webp	Для глубокой химчистки. Щетка утюжок — чистота до блеска! Это идеальный инструмент для безупречного ухода.	Щетина, пластик.	Возьмите щетку и круговыми движениями с умеренным нажимом начинайте тереть загрязненное место	t	500	2026-04-27 12:05:32.97225+00	0
46	61	88	000016	Ершик для мытья дисков	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/494bace37d214f3cafe600b1e8db01a0.webp	Щетка для чистки автомобильных литых дисков и шин помогает эффективно удалять грязь, тормозную пыль с колес. Ершики имеет прочную ручку и щетинки, предназначенные для проникновения в труднодоступные места. Он поможет добраться до мест, куда обычная щетка не достает, например, между спицами и в углублениях диска. Щетинки ершика не царапают лакокрасочное покрытие диска. Ручка позволяет легко маневрировать и достигать всех участков колеса, а конусообразная форма позволяет проникать в самые узкие места. Для лучшего результата используйте щетку вместе со специальным моющим средством. Промывайте ее после каждого использования, чтобы продлить срок службы ершика. Использование ершика для мытья автомобильных дисков делает процесс мойки гораздо проще и эффективнее, обеспечивая блеск и чистоту ваших колесных дисков.	Пластик.	Для мытья дисков автомобиля ершиком сначала дайте колесам остыть, затем смойте крупную грязь сильной струей воды, чтобы песок и абразив не поцарапали поверхность при трении щеткой. Равномерно нанесите на диск специальный очиститель для колес и подождите 3-5 минут для растворения тормозной пыли. Водите ершиком плавно, без сильного нажима; если грязь не отходит, лучше повторить нанесение средства, а не тереть с усилием. По мере загрязнения промывайте щетину ершика в чистой воде. После очистки тщательно смойте остатки пены и грязи чистой водой. По окончании работы промойте ершик водой.	t	600	2026-04-27 12:10:37.096456+00	0
52	61	89	000022	Шланг для мойки высокого давления 1SN06, 25 м.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/574ed93aa3474bc98ef0b00f11ee93d2.webp	Максимальное давление: 900 бар (рабочее давление 225 бар),\nМаксимальная температура: 150 С\nОплетка шланга: 13 мм. (железная)\nДиаметр шланга (внутр.): 6 мм (1/4")	Резина.	Способ применения: подсоедините один конец шланга к выходному фитингу мини-мойки, а второй конец — к пистолету-распылителю с насадками. После подключения включите аппарат и подайте воду — убедитесь, что все соединения герметичны и нет протечек. При работе учитывайте увеличенную длину шланга: не допускайте его перегибов, наездов колес или острых предметов, чтобы избежать повреждения. По окончании работы перекройте подачу воды, стравьте остаточное давление, отключите шланг от аппарата и пистолета, затем просушите его и смотайте для хранения без узлов и заломов.	t	5100	2026-04-27 12:25:45.445826+00	0
37	62	\N	000007	Тормозная жидкость Рольф Brake&Clutch DOT-4 CLASS 6, 910 г.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/b66a7dac8884488ab3b2efe794325912.webp	ROLF Brake&Clutch Fluid DOT-4 CLASS 6 - низковязкая синтетическая тормозная жидкость на основе полигликолей и эфиров, содержащая ингибиторы коррозии и окисления с улучшенными эксплуатационными свойствами. Высокая температура кипения и улучшенные низкотемпературные характеристики обеспечивают корректную работу тормозной системы и сохраняют быстродействие системы ABS во время всего срока службы жидкости. Тормозная жидкость Рольф не оказывает отрицательного воздействия на детали тормозной системы. Нейтральна к резинотехническим и полимерным материалам.	В качестве основы используется полиэтиленгликоль в сочетании с полиэфирами борной кислоты.	Может применяться в различных транспортных средствах, где требуется высокая эффективность и надежность работы гидравлической системы тормозов в автомобилях оборудованных антиблокировочной системой (ABS), системой динамической стабилизации (ESP), противобуксовочной системой (TCS) динамической системой курсовой устойчивости (ASC). Использовать в соответствии с инструкциями автопроизводителей.	t	510	2026-04-27 11:11:39.034296+00	0
53	61	89	000023	Шланг высокого давления для мойки Karcher, 20 м.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/22beb19b378b4bdebc91b9ab15499c11.webp	Надежный шланг для мойки Karcher (шланг для мойки высокого давления 20 метров) — оптимальное решение для эффективной очистки различных поверхностей. Шланг для Karcher 10м совместим с моделями серий K2, K3, K4, K5, K7 (включая версии Compact, Car, Premium и FullControl), что делает шланг для мойки karcher к5 универсальным выбором для домашнего и профессионального использования. Удобство использования. Система Quick‑Connect позволяет подключать и отсоединять шланг для автомойки высокого давления на Karcher К3, шланг на Karcher К2, шланг для Karcher К7 одним щелчком. Длина 10м (шланг на karcher к7, шланг для karcher k5) обеспечивает свободу движений при работе.\nШланг для мойки Керхер можно использовать с катушками (для моделей Premium), что упрощает хранение и эксплуатацию.\nВажно:\nШланг для karcher к5 не является оригинальной продукцией Karcher, но полностью совместим с техникой указанной марки;\nперед покупкой сравните разъём вашего аппарата со штуцером на фото.	Резина, сталь.	Способ применения: подсоедините один конец шланга к выходному фитингу мини-мойки, а второй конец — к пистолету-распылителю с насадками. После подключения включите аппарат и подайте воду — убедитесь, что все соединения герметичны и нет протечек. При работе учитывайте увеличенную длину шланга: не допускайте его перегибов, наездов колес или острых предметов, чтобы избежать повреждения. По окончании работы перекройте подачу воды, стравьте остаточное давление, отключите шланг от аппарата и пистолета, затем просушите его и смотайте для хранения без узлов и заломов.	t	3400	2026-04-27 12:29:22.873543+00	0
48	61	88	000018	Крышка с дозирующим краном	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/6a453d4c49da412f948d60ab025add18.webp	Кран-крышка для канистры 20л. Предназначена для дозированного слива различных жидкостей, кроме ГСМ. Кран-крышка оснащен перекрывающим механизмом особой прочности, что повышает рабочий ресурс изделия. Внутренний диаметр крышки 50 мм. Подходят для канистр Grass и Detail.	Пластик.	Установите крышку с краном вместо штатной пробки, убедившись в герметичности резьбового соединения.	t	600	2026-04-27 12:14:51.153525+00	0
51	61	89	000021	Шланг для мойки высокого давления, 20 м.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/909a0cd93ae74db2ba7bcfc7a426517a.webp	Данный шланг высокого давления предназначен для интенсивной эксплуатации с профессиональными мойками высокого давления и другим оборудованием. Рукав высокого давления 20 метров с внутренним диаметром 8 мм обеспечивает мобильность и высокую пропускную способность. Это надежный шланг для подключения насоса высокого давления к пистолету.\nГидрошланг изготовлен в соответствии со стандартом DIN EN853 2SN, что гарантирует его прочность. Конструкция включает двухслойную металлическую оплетку, обеспечивающую рабочее давление до 350 бар (шланг 350 бар) и высокую стойкость к разрыву до 1200 бар. Шланг высокого давления 8мм гайка оснащен стандартными соединениями М22x1.5 мм на обоих концах, что обеспечивает совместимость с большинством моделей профессиональной техники.	Резина, сталь.	Способ применения: подсоедините один конец шланга к выходному фитингу мини-мойки, а второй конец — к пистолету-распылителю с насадками. После подключения включите аппарат и подайте воду — убедитесь, что все соединения герметичны и нет протечек. При работе учитывайте увеличенную длину шланга: не допускайте его перегибов, наездов колес или острых предметов, чтобы избежать повреждения. По окончании работы перекройте подачу воды, стравьте остаточное давление, отключите шланг от аппарата и пистолета, затем просушите его и смотайте для хранения без узлов и заломов.	t	6000	2026-04-27 12:23:09.237327+00	0
38	62	\N	000008	OEM Japan & Korea антифриз красный готовый, 1 кг.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/40298a6559334aa6888faaa039870263.webp	SINTEC Antifreeze OEM Japan & Korea - это высококачественная охлаждающая жидкость нового поколения, разработанная специально для систем охлаждения автомобилей японских и корейских марок. В её основе лежит фосфатно-лобридная технология (P-OAT), которая сочетает органические кислоты и фосфатные соединения. Не содержит силикатов, аминов, нитритов и боратов, что критически важно для азиатских двигателей.	Высокоочищенный этиленгликоль, пакет органических кислот.	Если производится полная замена, слейте старый антифриз и промойте систему охлаждения дистиллированной водой (при необходимости). Если нужно долить, просто залейте антифриз в расширительный бачок или радиатор до отметки "Full" (макс.).	t	470	2026-04-27 11:16:14.343507+00	0
55	69	\N	000025	Смазка силиконовая Silicone Service, 400 мл	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/f989d5081dcf4199844c52d3896aebb5.webp	Защищает резиновые уплотнители, пластиковые детали, направляющие и механизмы от пересыхания, скрипа и примерзания.	Силиконовое масло, растворитель, антикоррозионные добавки, пропеллент.	Встряхнуть баллон. Нанести тонким слоем на очищенную поверхность. Излишки удалить салфеткой.	t	740	2026-04-27 16:17:00.856477+00	0
56	69	\N	000026	Преобразователь ржавчины RustStop, 500 мл	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/73b3d4c85b9142e5953f740877771007.webp	Преобразует коррозию в защитный слой и подготавливает металлическую поверхность к дальнейшей обработке или окрашиванию.	Ортофосфорная кислота, ингибиторы коррозии, вода, функциональные добавки.	Очистить поверхность от рыхлой ржавчины. Нанести средство кистью или распылителем. Оставить на 15–30 минут, затем удалить остатки и высушить.	t	920	2026-04-27 16:17:31.014947+00	0
58	67	\N	000028	Автомобильная эмаль BaseColor Premium, 520 мл	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/deff04975622499f929adfd490cc2341.webp	Профессиональная аэрозольная эмаль для локального ремонта кузова, деталей и элементов экстерьера. Образует ровное стойкое покрытие.	Акриловая эмаль, цветовые пигменты, растворители, связующие компоненты, пропеллент.	Поверхность очистить, обезжирить и загрунтовать. Встряхнуть баллон. Нанести 2–3 слоя с расстояния 20–30 см. Полное высыхание — до 24 часов.	t	1290	2026-04-27 16:19:20.415491+00	5
54	69	\N	000024	Профессиональный очиститель тормозов BrakeClean Pro, 650 мл	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/d193be9f1bff4d2984a3f4ba8e525385.webp	Быстро удаляет масло, грязь, тормозную пыль и технические загрязнения с деталей тормозной системы. Подходит для СТО и сервисных зон.	Органические растворители, пропеллент, очищающие компоненты.	Распылить на загрязнённую поверхность с расстояния 15–20 см. Дать стечь загрязнениям. При необходимости повторить обработку.	t	890	2026-04-27 16:16:19.104174+00	5
57	67	\N	000027	Грунт акриловый AutoPrimer Professional, 520 мл	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/2dcb5a3b1d5f46a293e21f6f993dc1d3.webp	Универсальный грунт для подготовки металлических, пластиковых и окрашенных поверхностей перед нанесением краски. Улучшает адгезию и выравнивает основание.	Акриловые смолы, пигменты, растворители, антикоррозионные добавки, пропеллент.	Очистить и обезжирить поверхность. Встряхнуть баллон 2–3 минуты. Нанести 2–3 тонких слоя с промежуточной сушкой 5–10 минут.	t	1020	2026-04-27 16:18:46.047315+00	5
59	67	\N	000029	Лак акриловый прозрачный ClearCoat Premium, 520 мл	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/8160e288eb5b46489a2e0f569732d686.webp	Финишное прозрачное покрытие для защиты окрашенных деталей. Придаёт блеск, повышает стойкость к влаге, реагентам и УФ-излучению.	Акриловые смолы, органические растворители, УФ-стабилизаторы, пропеллент.	Наносить на высохший слой краски в 2–3 тонких слоя с расстояния 20–30 см. Межслойная сушка — 10–15 минут.	t	1350	2026-04-27 16:20:24.710573+00	0
61	60	94	000031	Холодный воск для автомобиля Grass "Cherry Wax", жидкий воск для быстрой сушки кузова, 20л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/2f85c8dd322e4f419d84bb492492d126.webp	Концентрированный эффективный продукт, защищающий автомобиль от внешних воздействий окружающей среды. Обладает высокой водоотталкивающей способностью, ускоряя процесс высыхания кузова после мойки. Придает дополнительный блеск и антистатические свойства. Не пачкает и не повреждает стекла. Эффективен даже при использовании жесткой воды и низких температурах. Может использоваться в мойках тоннельного и портального типа.	≥30% вода, ≥5%, но <15% органические растворители, <5%: катионные ПАВ, неионогенные ПАВ, ароматизирующая добавка, краситель.	Для распылителя концентрат разбавить с водой в пропорции 1:25 (1:50) или 20-40 г/л. Для пенокомплекта разбавить с водой в пропорции 1:3 (1:5) или 300-200 г/л. Нанести на предварительно очищенную поверхность. Излишки средства смыть водой под давлением. Через автоматическую систему дозирования: разбавить согласно инструкции по эксплуатации моющего оборудования.	t	6650	2026-04-28 06:39:25.064758+00	0
60	60	94	000030	Холодный воск (концентрат) AVS AVK-708, 0.5 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/41283b26414b41128d241973a6a38206.webp	Концентрированный продукт – превосходно защищает автомобиль от внешних воздействий окружающей среды. Образуемая составом тонкая полимерная пленка придает поверхности грязе-, водоотталкивающие свойства, усиленный блеск, защищает от атмосферных осадков и разрушающего действия дорожных реагентов. Обеспечивает быстрое скатывание капель воды, что существенно сокращает время сушки. Ускоряет процесс комплексной обработки автомобиля. Безопасен для любых типов лакокрасочных покрытий. Не оставляет разводов.	Вода обессоленная >30%, омпозиция КПАВ 5-15%, органический растворитель 10-20%, органическая кислота <5%, отдушка <5%, консервант <5%.	1. Концентрат разбавить с водой в пропорции 1:25-1:50 или 20-40 мл на 1 литр воды.\n2. Нанести на поверхность с помощью распылителя или через дозировочную систему.\n3. Остатки средства смыть водой.\nНанести на предварительно вымытый автомобиль. После нанесения смыть обильным количеством воды. Протереть насухо чистой мягкой тканью или замшей.\nВажно! Состав наносить на чистый и влажный кузов.	t	410	2026-04-28 06:36:05.907672+00	0
62	60	94	000032	Воск Grass Fast Wax, 5 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/3ab19252e08c4692862cd5420cfded34.webp	Холодный воск Grass «Fast Wax» обладает высокой водоотталкивающей способностью, обеспечивает быстрое высыхание автомобиля после мойки. Поверхность остается совершенно сухой и блестящей. Не пачкает и не повреждает стекла. Эффективно в любое время года. \nПреимущества:\n    • высокая водоотталкивающая способность;\n    • более быстрое высыхание автомашины после мойки;\n    • наличие антистатического эффекта;\n    • возможность разведения с жёсткой водой;\n    • экономичный расход;	Вода, воск эмульсионный, консервант, краситель, ароматизатор.	1. Помойте автомобиль бесконтактным шампунем GraSS. 2 Выполните мойку ручным шампунем GraSS используя крупнопористую губку (мойка ручным шампунем необходима для удаления оставшихся загрязнений). 3 Для пенокомплекта разбавьте с водой в пропорции 1:10-1:20 (90-47 г/л). Для распылителя концентрат разбавьте с водой в пропорции 1:50-1:100 (10-5 г/л). 4 Нанесите разбавленный состав на обрабатываемую поверхность. 5 Смойте водой под давлением остатки средства с поверхности.	t	3800	2026-04-28 06:41:50.180249+00	0
63	60	94	000033	Complex Tutela Воск для быстрой сушки кузова с ароматом Bubble gum, 5 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/35174ccdd730429293f69ccf99300117.webp	Разрывает сплошную водную пленку на отдельные фрагменты, которые быстро соскальзывают с поверхности автомобиля.\nСокращает время комплексной обработки автомобиля.\nСоздает защитную пленку, которая препятствует дальнейшему загрязнению и обеспечивает легкий антикоррозионный и гидрофобный эффект.\nПридает блеск автомобилю, маскируя мелкие царапины.\nПродлевает срок службы лакокрасочного покрытия.	Вода, воск эмульсионный, консервант, краситель, ароматизатор.	Перед применением взболтать. С использованием пенокомплекта (насадки на аппарат высокого давления) рекомендовано типовое разведение 100 мл на 1 л воды. В зависимости от настроек пенокомплекта разведение подбирается опытным путем в диапазоне от 50 мл до 125 мл на 1 л воды. С использованием триггера или пульверизатора, развести с водой в пропорции 10-20 мл на 1 л воды.	t	3220	2026-04-28 06:44:55.753394+00	0
47	61	88	000017	Водосгон автомобильный AVS SB-0505	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/d695d50d0d8348f59957a3f002b0e4fa.webp	Водосгон для автомобиля AVS SB-0505 M - это скребок автомобильный для качественной мойка стекла и удаления воды. Водосгон для стекол имеет специальный износостойкий состав мягкого лезвия для лучшего результата. Удобная эргономичная изогнутая форма - то, что делает водосгон для мытья окон еще удобнее . Скребок для окон поможет сделать стекла автомобиля чистыми и обеспечить не только аккуратный вид транспортному средству, но и значительно улучшить видимость при вождении. Правильно называется такой скребок для мытья водосгоном, так как он прекрасно осуществляет сгон воды без отсутствия разводов на стекле и не царапая поверхность стекла. Нескользящая ручка данного изделия хорошо ложится в руку и по своим габаритам очень удобно проходит по лобовому стеклу при мойке автомобиля. Водосгон для стекла имеет мягкое лезвие из износостойкой резины. Скребок для воды может быть позелен не только в автомобиле, но и в быту для очистки окон, зеркал и прочих стеклянных поверхностей.	Пластик.	Перед началом работы убедитесь, что автомобиль тщательно вымыт и с поверхностей смыты все абразивные частицы грязи и песка, так как оставшаяся грязь при использовании водосгона может поцарапать лакокрасочное покрытие . Сам водосгон перед каждым применением рекомендуется промыть чистой водой . Начинайте сушку сразу после финального ополаскивания, пока вода не успела высохнуть на солнце или ветру, иначе могут образоваться трудноудаляемые пятна .	t	250	2026-04-27 12:12:25.306262+00	0
49	61	89	000019	Шланг для мойки высокого давления Хутер 10 м., 225Bar	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/b8d77195d2b743f7a7ee0bb5ae9844de.webp	Шланг для мойки HUTER с одной металлической оплеткой прослужит дольше чем обычный из ПВХ, имеет параметры 1SN DN06 где внутренний диаметр 6 мм. Рабочее давление 225 бар, максимальное давление на разрыв 700 бар. Тип подключения накидная гайка с резьбой М14х1,5 и пластиковая гайка с ниппелем М22х1,5. Рукав высокого давления для данной мойки длиной 10 метров — это незаменимый аксессуар для эффективной и удобной эксплуатации моечных аппаратов, Eurolux W-175 PRO и РЕСАНТА.	Резина, сталь.	Способ применения: подсоедините один конец шланга к выходному фитингу мини-мойки, а второй конец — к пистолету-распылителю с насадками. После подключения включите аппарат и подайте воду — убедитесь, что все соединения герметичны и нет протечек. При работе учитывайте увеличенную длину шланга: не допускайте его перегибов, наездов колес или острых предметов, чтобы избежать повреждения. По окончании работы перекройте подачу воды, стравьте остаточное давление, отключите шланг от аппарата и пистолета, затем просушите его и смотайте для хранения без узлов и заломов.	t	2600	2026-04-27 12:18:39.559615+00	0
50	61	89	000020	Шланг высокого давления Makita 197850-3, 20 м.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/c6c44dd8619642068854a3fbe1982aa6.webp	Шланг высокого давления Makita 197850-3 предназначен для использования в системах с высоким давлением. Длина шланга составляет 10 метров, что обеспечивает удобство эксплуатации на значительном расстоянии. Максимальное рабочее давление — 150 бар, что позволяет использовать его для интенсивных задач. Шланг устойчив к воздействию воды температурой до 40 градусов Цельсия. Подходит для подключения к мойкам высокого давления и другим устройствам, совместимым с данной моделью. Прочная конструкция обеспечивает долговечность и надежность в эксплуатации. Шланги высокого давления Makita — это идеальное решение для профессионального и бытового применения.	Резина, сталь.	Способ применения: подсоедините один конец шланга к выходному фитингу мини-мойки, а второй конец — к пистолету-распылителю с насадками. После подключения включите аппарат и подайте воду — убедитесь, что все соединения герметичны и нет протечек. При работе учитывайте увеличенную длину шланга: не допускайте его перегибов, наездов колес или острых предметов, чтобы избежать повреждения. По окончании работы перекройте подачу воды, стравьте остаточное давление, отключите шланг от аппарата и пистолета, затем просушите его и смотайте для хранения без узлов и заломов.	t	14900	2026-04-27 12:20:23.705482+00	0
64	66	\N	000034	Блеск для шин AIM-ONE TS-500 Чернение шин покрышек, 650 мл.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/4743fa5a358f42298d749cfacc050ffb.webp	Блеск для шин AIM-ONE (без пены) 650мл. TS-500 Чернение шин покрышек - это эффективное средство, специально разработанное для поддержания и восстановления блеска шин автомобиля. С его помощью вы сможете придать шинам насыщенный черный цвет, который будет выглядеть стильно и эстетично.\nПродукт имеет удобную формулу без пены, что позволяет быстро и легко наносить блеск на шину. Вы просто наносите средство на поверхность шины, равномерно распределяете его с помощью губки или тряпки и получаете мгновенный результат. Блеск для шин AIM-ONE создает защитный слой, который оберегает шину от воздействия внешних факторов, таких как пыль, грязь и солнечные лучи.\nКроме того, этот продукт также обладает отличными очищающими свойствами. Он эффективно удаляет загрязнения с поверхности шин, придавая им свежий и чистый вид. Блеск для шин AIM-ONE не оставляет разводов и следов на поверхности, обеспечивая идеальный результат после каждого применения.	Органические растворители ≥81%, полиметилсилоксановые жидкости ≥13%, функциональные добавки ≤5%, отдушка парфюмерная ≤1%. Содержит озонобезопасный углеводородный пропеллент (пропан-бутан).	Очистите и высушите поверхность шины. Баллон хорошо встряхните. Распылите блеск равномерным слоем с расстояния 15 см от покрышки . Подождите 3–5 минут до полного высыхания — протирать не требуется . При необходимости для усиления блеска повторите нанесение .	t	302	2026-04-28 07:07:30.018058+00	0
65	66	\N	000035	Очиститель дисков и кузова с индикатором Smart Shine IRON PRO, 5 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/66da630f1f724f78b8f21fcbc71ff36c.webp	Бескислотный состав для удаления металлических вкраплений с индикацией остаточных загрязнений, для кузова и колесных дисков автомобиля. Благодаря нейтральному Ph, бережно относится к лакокрасочному покрытию, не наносит вреда хромированным, пластиковым, а также резиновым элементам кузова.	Комплексообразователь, анионные ПАВ, неионогенные ПАВ, отдушка, краситель.	Не наносить на горячую поверхность! Нанести на поверхность с помощью распылителя выждать 3-5 минут, при необходимости использовать щетку или кисть. Смыть остатки с помощью высокого давления.	t	3160	2026-04-28 07:10:05.552676+00	10
66	66	\N	000036	AVS Чернитель шин Концентрат, 5 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/6a432b8efd144e52a2e055915344ede0.webp	Восстанавливает и защищает поверхность — глубоко проникает в резину, устраняет потёртости и предотвращает старение. Подходит для любых сезонов — сохраняет эффект даже при перепадах температур и интенсивной эксплуатации. Универсальное применение — эффективно обрабатывает шины и диски различных типов транспорта. Экологически безопасен — не содержит агрессивных компонентов, безопасен для окружающей среды и пользователя.	Отдушка менее 5%, краситель менее 5% , кремний органические полимеры менее 5%, К-ПАВ 5-15%, Н-ПАВ 5-15%, вода более 30%.	Концентрат разбавьте водой в соотношении 1:4–1:7 . Готовый состав нанесите на чистые сухие шины с помощью распылителя или губки, равномерно распределите по поверхности. Дайте высохнуть естественным путем, протирать не требуется.	t	1500	2026-04-28 07:13:02.552675+00	0
67	66	\N	000037	Средство для очистки дисков и следов насекомых "Rim&Bug Cleaner", 22.5 кг.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/0ef9a665e3a74926ad247599607f745b.webp	Концентрированное чистящее средство на основе эффективных компонентови активных добавок. Предназначено для быстрого и легкого удаления остатков насекомых\nс кузова и деталей автомобиля, а также для очистки колесных дисков от нагара, грязи и пыли. Обладает высокой очищающей способностью.	>30% вода очищенная; <5%: анионный ПАВ, неионогенный ПАВ, соль ЭДТА, гидроксид натрия, ароматизирующая добавка, краситель.	1. Перед нанесением средство необходимо разбавить с водой из расчета 10-20 г/л для пеногенератора (25, 50, 100 л) или 60-90 г в пенокомплект (1 л), в зависимости от степени загрязнения. 2. Смыть водой верхний слой грязи, после чего нанести моющий раствор. 3. Выдержать не более 2 минут, не допуская высыхания! 4. Тщательно смыть водой под высоким давлением с близкого расстояния (15-20 см).	t	6800	2026-04-28 07:18:33.2269+00	0
69	63	\N	000039	AVS Клей автомобильный Аэрозоль, 210 мл.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/f649e27af9054de9bef4f7377a8bd47e.webp	Универсальный клей аэрозоль 210 мл - это идеальное решение для любителей автомобилей. Этот клей предназначен для склеивания различных материалов, таких как пластик, металл, дерево и ткань. Он обладает высокой прочностью и долговечностью, что обеспечивает надежное соединение между частями автомобиля.\nКлей аэрозоль универсальный 210 мл имеет удобную формулу, которая позволяет легко наносить его на поверхность без лишних усилий. Он быстро высыхает и образует прочное соединение, которое не разрушится при воздействии высоких температур или воды.\nЭтот клей является отличным выбором для тех, кто хочет быстро и эффективно выполнить ремонт своего автомобиля. Он обладает высокой прочностью и долговечностью, что обеспечивает надежное соединение между частями автомобиля.	Клей изготовлен на основе синтетического каучука (содержание 15%), растворенного в смеси органических растворителей. В состав также входят алифатические и ароматические углеводороды (в совокупности более 30%) в качестве растворителей, а также углеводородный пропеллент (газ-вытеснитель) для распыления.	Распыляйте клей с расстояния 20-25 см от поверхности, нанося тонкий равномерный слой.	t	250	2026-04-28 07:28:33.318442+00	0
68	63	\N	000038	Герметик для формирования прокладок AXIOM высокотемпературный, черный ASK147, 0.28 л.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/ead3c5cc049d49978694732ada64172f.webp	Высокотемпературный однокомпонентный силиконовый герметик AXIOM ASK147 применяется для формирования или ремонта прокладок в узлах автомобиля, подверженных воздействию высоких температур, таких как поддоны картера и коробки передач, водяной насос, крышка газораспределительного механизма, корпус термостата и др. Способен заменить прокладки, сальники, а также бумажные, резиновые, металлические и другие уплотнители. Может наноситься на штатные прокладки для улучшения их эксплуатационных свойств. Не рекомендуется для применения между головкой и блоком цилиндров!\nНейтральный, не содержит растворителей и кислот, не вызывает коррозии, может применяться для герметизации электрических соединений и датчиков. Подходит для герметизации и ремонта автомобильных фар. Заполняет полости и зазоры до 7 мм.\nОбладает повышенной адгезией к поверхностям из стали, чугуна, алюминия. Стоек к воздействию технических жидкостей автомобиля (смазочных материалов, охлаждающих жидкостей, растворов кислот и щёлочей). Вулканизирующийся при комнатной температуре (RTV) силикон образует прочную, эластичную прокладку (удлинение до разрыва 500%). Отверждённый герметик может эксплуатироваться в температурном диапазоне от -60 до +345 градусов (кратковременно).	Формула включает силиконовый полимер, пластификатор, вулканизирующий агент, наполнители, активатор адгезии и функциональные добавки .	Работы проводите при температуре окружающей среды от +5°C до +40°C, температура герметика должна быть +20–25°C . Поверхности тщательно очистите, обезжирьте и просушите – для удаления старого герметика используйте специальный удалитель, для обезжиривания подойдет очиститель тормозов . Вставьте тубу в монтажный пистолет, срежьте носик колпачка под углом 45° на нужный диаметр (обычно 2–3 мм). Нанесите герметик непрерывной однородной полосой толщиной 2–3 мм на одну из соединяемых поверхностей – сначала по внутреннему периметру, затем вокруг крепежных отверстий . Соедините детали сразу после нанесения, не дожидаясь начала полимеризации. Поверхностная пленка образуется через 7–15 минут, полное отверждение наступает через 24 часа при температуре +23°C и влажности 55% . Излишки свежего герметика удалите растворителем, затвердевший герметик удаляется механически.	t	1100	2026-04-28 07:24:54.701538+00	10
70	63	\N	000040	Клей для зеркал ULTIMA Mirror Bond 280 ml ULADH01260, 280 мл.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/50a8679f26a2443b89ed5efdc3a69b94.webp	ULTIMA Mirror Bond — профессиональный монтажный клей для скрытой установки зеркал разработан для надежной фиксации зеркальных полотен на любые типовые поверхности без повреждения амальгамы и использования механического крепежа.	Синтетический каучук, минеральные наполнители (карбонат кальция, каолин), органические растворители.	Нанесите клей на одну из склеиваемых поверхностей. Для более аккуратного нанесения рекомендуется использовать малярную ленту, которую следует снять до застывания клея.  Оставьте нанесенный клей на 5-10 минут.	t	310	2026-04-28 07:33:44.964486+00	0
71	63	\N	000041	Автомобильный нейтральный высокотемпературный герметик DONEWELL силиконовый, 118 мл.	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/589a06174c38413c9bb817fe3e52d70a.webp	Автомобильный нейтральный высокотемпературный герметик DONEWELL силиконовый, 118 мл, серый DGT-215 для формирования и ремонта прокладок в узлах автомобиля, таких как поддон картера двигателя и коробки передач, корпуса термостата, водяного насоса и других. Способен заменить собой бумажные, резиновые, металлические и другие уплотнители. Не содержит растворителей и кислот, не вызывает коррозии, может применяться для герметизации электрических соединений и датчиков. Стоек к воздействию автомобильных технических жидкостей (за исключением бензина). Тиксотропный, не растекается и не сползает по шву. Заполняет полости и зазоры до 7 мм. Отверждённый герметик может эксплуатироваться в температурном диапазоне от –50°C до +250°C (кратковременно до +330°C). На 8,5–9 погонных метра при диаметре валика 4 мм.	Силиконовый герметик выполнен по нейтральной формуле, не содержит растворителей и кислот.	Нанесите герметик непрерывным равномерным валиком на одну из склеиваемых поверхностей, располагая его по периметру соединяемой детали, а также вокруг всех крепежных отверстий. Рекомендуемая толщина валика — 2-3 мм, что обеспечивает заполнение зазоров до 7 мм после сжатия. Соедините детали сразу после нанесения герметика, не дожидаясь образования поверхностной пленки.	t	250	2026-04-28 07:36:30.457586+00	0
72	61	90	000042	Пеногенератор «KARCHER PGH 4-15-20»	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/5944c90deaf64762ad8b4254dad82ff5.webp	Оригинальный пеногенератор KARCHER для бесконтактной мойки автомобилей и наружных поверхностей. Создаёт густую стабильную пену, которая активно удаляет грязь и снижает риск повреждения ЛКП. Объём бака 1,5 литра. Работает со всеми мойками высокого давления KARCHER серий K2–K7 и с другим оборудованием через переходник. Регулировка количества пены прямым поворотом насадки.	Полипропилен армированный 65%, латунь никелированная 18%, нержавеющая сталь AISI 304 7%, синтетический каучук NBR 5%, керамический наконечник 3%, полиамид 2%.	Налейте в бак автошампунь и воду в соотношении согласно инструкции к шампуню (обычно 100–200 мл на 1,5 л воды). Закрутите крышку. Подключите пеногенератор к пистолету мойки. Регулировочным кольцом установите желаемую густоту пены. Нанесите состав на кузов снизу вверх. Выдержите 3–5 минут, смойте водой под давлением. После использования промойте генератор чистой водой.	t	11980	2026-04-28 09:15:07.028562+00	0
73	61	90	000043	Пеногенератор профессиональный «GRASS PG-0103»	https://ccc87c66ef78-optovikavtokhim.s3.ru1.storage.beget.cloud/products/0bb4d8d284754cc1b33fb5f4d44cbd24.webp	Профессиональный пеногенератор GRASS PG-0103 используется на автомойках для нанесения моющих растворов на любые поверхности. Объём бака 50 литров. Бак выполнен из окрашенной стали толщиной 3 мм, внутри обработан полимерным составом для защиты от химической коррозии. Оснащён большими пластиковыми колёсами для удобной транспортировки. Максимальное давление 8 бар.	Окрашенная сталь (толщина 3 мм) 85%, латунь 8%, пластик 4%, резина EPDM 3%.	Залейте в бак воду и концентрат пенообразователя (согласно инструкции к средству). Закройте крышку. Подключите компрессор или водоснабжение. С помощью регуляторов настройте подачу воздуха и химии. Направьте копьё на обрабатываемую поверхность, откройте кран. Равномерно нанесите пену слоем 3–5 см. Выдержите необходимое время (по инструкции к пенообразователю). Смойте водой под давлением. После использования промойте систему чистой водой.	t	29500	2026-04-28 09:20:37.38922+00	0
\.


--
-- Data for Name: subcategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subcategories (id, name, created_at, category_id) FROM stdin;
60	Микрофибра, губки, салфетки	2026-02-15 16:51:02.821798+00	\N
61	Полировальные пасты и круги	2026-02-15 16:51:14.427196+00	\N
70	новая	2026-03-22 18:32:24.043463+00	\N
71	новая2	2026-03-22 18:32:24.043463+00	\N
79	sdgs	2026-03-24 12:24:06.950108+00	\N
80	sdg	2026-03-24 12:24:06.950108+00	\N
85	test10	2026-03-24 12:34:17.623312+00	\N
58	Пылесосы	2026-02-15 16:50:22.470205+00	\N
59	Компрессоры	2026-02-15 16:50:32.03248+00	\N
56	Полироли и воски	2026-02-15 16:49:39.137194+00	\N
62	Щетки и сгоны	2026-02-15 16:51:40.368288+00	\N
63	Ароматизаторы	2026-02-15 16:51:48.394691+00	\N
88	Аксессуары	2026-04-27 11:47:52.571415+00	61
89	Шланги высокого давления	2026-04-27 11:47:52.571415+00	61
90	Пеногенераторы	2026-04-27 11:47:52.571415+00	61
92	ывпывп	2026-04-27 13:00:22.719579+00	\N
86	Автошампуни	2026-04-27 10:44:05.409454+00	60
94	Воски для сушки	2026-04-27 13:19:47.654761+00	60
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, role, hashed_password, inn, kpp, legal_address, created_at, legal_name, user_type, full_name, phone) FROM stdin;
35	optovikautohim@mail.ru	admin	$2b$12$zVNwALs/KEOfSO1LP0Tq8O.QGi1Pzwx7ri4je91ab9f2kkteteHuC	\N	\N	\N	2026-03-28 10:50:30.514591+00	\N	person	Холоднов Павел Львович	89614536432
37	nenotice65@gmail.com	user	$2b$12$BTSeY7LScwa6m0MK4NHfxe693GLljfMy52yd/yw.GEq7ASI7ynBVy	7736207543	770401001	119021, г. Москва, ул. Льва Толстого, д. 16	2026-03-28 10:52:56.58129+00	ООО «Яндекс»	legal	\N	\N
36	stassinelnikov6@gmail.com	user	$2b$12$khO9aIJ7eMftMoRyJ1WDROBdFAtDg8Tc1KGFw7/3gIXkFaInYODBu	\N	\N	\N	2026-03-28 10:51:48.00795+00	\N	person	Синельников Станислав Евгеньевич	89281046657
38	stasfrost47@gmail.com	user	$2b$12$0ROjj8Q1TWH..JVVXgPePekjtarr9aQMwQ.5gfpGoEJCP50DSwUui	\N	\N	\N	2026-03-30 19:18:11.870043+00	\N	person	Иванов Иван Иванович	89281046657
39	yanavedenova@gmail.com	user	$2b$12$gwxEYd6cbHVi1f5mqoZWr.YoSRmswC.bEC/ymr1bRVD/eSEF166GS	\N	\N	\N	2026-04-04 15:12:07.120839+00	\N	person	Веденова Яна Олеговна	89896272942
\.


--
-- Name: cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_id_seq', 65, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 69, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 42, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 73, true);


--
-- Name: subcategories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subcategories_id_seq', 94, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 39, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: codes codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.codes
    ADD CONSTRAINT codes_pkey PRIMARY KEY (email);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: subcategories subcategories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_pkey PRIMARY KEY (id);


--
-- Name: cart uq_cart_user_product; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT uq_cart_user_product UNIQUE (user_id, product_id);


--
-- Name: subcategories uq_subcategory_name_category; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT uq_subcategory_name_category UNIQUE (name, category_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_cart_id ON public.cart USING btree (id);


--
-- Name: ix_cart_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_cart_product_id ON public.cart USING btree (product_id);


--
-- Name: ix_cart_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_cart_user_id ON public.cart USING btree (user_id);


--
-- Name: ix_categories_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_categories_id ON public.categories USING btree (id);


--
-- Name: ix_categories_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_categories_name ON public.categories USING btree (name);


--
-- Name: ix_codes_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_codes_email ON public.codes USING btree (email);


--
-- Name: ix_orders_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_orders_id ON public.orders USING btree (id);


--
-- Name: ix_orders_number_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_orders_number_order ON public.orders USING btree (number_order);


--
-- Name: ix_orders_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_orders_user_id ON public.orders USING btree (user_id);


--
-- Name: ix_products_article; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_products_article ON public.products USING btree (article);


--
-- Name: ix_products_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_products_id ON public.products USING btree (id);


--
-- Name: ix_products_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_products_name ON public.products USING btree (name);


--
-- Name: ix_subcategories_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_subcategories_id ON public.subcategories USING btree (id);


--
-- Name: ix_subcategories_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_subcategories_name ON public.subcategories USING btree (name);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_inn; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_inn ON public.users USING btree (inn);


--
-- Name: ix_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_role ON public.users USING btree (role);


--
-- Name: cart cart_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: cart cart_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: products products_subcategory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(id) ON DELETE CASCADE;


--
-- Name: subcategories subcategories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict TVxg770CVToUnHFCbeoAqCM5Cp4PNcvsaGKVJvH7ea9jdE6RQViMdKP7MDu0s90

