/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     12/08/2020 7:31:14 p. m.                     */
/*==============================================================*/


drop table if exists CONCEPT_PARENT;

drop table if exists ENTRY;

drop table if exists ENTRY_TAG;

drop table if exists EQUATION;

drop table if exists EXAMPLE;

drop table if exists IDEA_CONCEPT;

drop table if exists IMAGE;

drop table if exists SOURCE;

drop table if exists TAG;

/*==============================================================*/
/* Table: CONCEPT_PARENT                                        */
/*==============================================================*/
create table CONCEPT_PARENT
(
   ID_PARENT            int not null,
   ID_CONCEPT           int not null,
   primary key (ID_PARENT, ID_CONCEPT)
);

/*==============================================================*/
/* Table: ENTRY                                                 */
/*==============================================================*/
create table ENTRY
(
   ID_ENTRY             int not null,
   TITLE_ENTRY          varchar(100),
   TEXT_ENTRY           varchar(10000) not null,
   TYPE_ENTRY           char(1) not null,
   primary key (ID_ENTRY)
);

/*==============================================================*/
/* Table: ENTRY_TAG                                             */
/*==============================================================*/
create table ENTRY_TAG
(
   ID_TAG               int not null,
   ID_CONCEPT           int not null,
   primary key (ID_TAG, ID_CONCEPT)
);

/*==============================================================*/
/* Table: EQUATION                                              */
/*==============================================================*/
create table EQUATION
(
   ID_EQUATION          int not null,
   ID_ENTRY             int not null,
   CODE_EQUATION        varchar(500) not null,
   TITLE_EQUATION       varchar(100),
   TEXT_EQUATION        varchar(1000),
   primary key (ID_EQUATION)
);

/*==============================================================*/
/* Table: EXAMPLE                                               */
/*==============================================================*/
create table EXAMPLE
(
   ID_EXAMPLE           int not null,
   ID_ENTRY             int not null,
   TITLE_EXAMPLE        varchar(100),
   TEXT_EXAMPLE         varchar(5000),
   primary key (ID_EXAMPLE)
);

/*==============================================================*/
/* Table: IDEA_CONCEPT                                          */
/*==============================================================*/
create table IDEA_CONCEPT
(
   ID_IDEA              int not null,
   ID_CONCEPT           int not null,
   primary key (ID_IDEA, ID_CONCEPT)
);

/*==============================================================*/
/* Table: IMAGE                                                 */
/*==============================================================*/
create table IMAGE
(
   ID_IMAGE             int not null,
   ID_ENTRY             int not null,
   FILE_IMAGE           longblob not null,
   TITLE_IMAGE          varchar(100),
   TEXT_IMAGE           varchar(1000),
   primary key (ID_IMAGE)
);

/*==============================================================*/
/* Table: SOURCE                                                */
/*==============================================================*/
create table SOURCE
(
   ID_SOURCE            int not null,
   ID_ENTRY             int not null,
   LINK_SOURCE          varchar(1000) not null,
   TITLE_SOURCE         varchar(100),
   TEXT_SOURCE          varchar(1000),
   primary key (ID_SOURCE)
);

/*==============================================================*/
/* Table: TAG                                                   */
/*==============================================================*/
create table TAG
(
   ID_TAG               int not null,
   NAME_TAG             varchar(100) not null,
   primary key (ID_TAG)
);

alter table CONCEPT_PARENT add constraint FK_CONCEPT_IN_PARENT foreign key (ID_PARENT)
      references ENTRY (ID_ENTRY) on delete restrict on update restrict;

alter table CONCEPT_PARENT add constraint FK_PARENT_IN_CONCEPT foreign key (ID_CONCEPT)
      references ENTRY (ID_ENTRY) on delete restrict on update restrict;

alter table ENTRY_TAG add constraint FK_TAG_IN_CONCEPT foreign key (ID_TAG)
      references TAG (ID_TAG) on delete restrict on update restrict;

alter table ENTRY_TAG add constraint FK_CONCEPT_IN_TAG foreign key (ID_CONCEPT)
      references ENTRY (ID_ENTRY) on delete restrict on update restrict;

alter table EQUATION add constraint FK_ENTRY_IN_EQUATION foreign key (ID_ENTRY)
      references ENTRY (ID_ENTRY) on delete restrict on update restrict;

alter table EXAMPLE add constraint FK_ENTRY_IN_EXAMPLE foreign key (ID_ENTRY)
      references ENTRY (ID_ENTRY) on delete restrict on update restrict;

alter table IDEA_CONCEPT add constraint FK_IDEA_IN_CONCEPT foreign key (ID_CONCEPT)
      references ENTRY (ID_ENTRY) on delete restrict on update restrict;

alter table IDEA_CONCEPT add constraint FK_CONCEPT_IN_IDEA foreign key (ID_IDEA)
      references ENTRY (ID_ENTRY) on delete restrict on update restrict;

alter table IMAGE add constraint FK_ENTRY_IN_IMAGE foreign key (ID_ENTRY)
      references ENTRY (ID_ENTRY) on delete restrict on update restrict;

alter table SOURCE add constraint FK_ENTRY_IN_SOURCE foreign key (ID_ENTRY)
      references ENTRY (ID_ENTRY) on delete restrict on update restrict;

