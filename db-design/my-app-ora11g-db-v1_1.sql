/*==============================================================*/
/* DBMS name:      ORACLE Version 11g                           */
/* Created on:     12/08/2020 7:32:42 p. m.                     */
/*==============================================================*/


alter table CONCEPT_PARENT
   drop constraint FK_CONCEPT_IN_PARENT;

alter table CONCEPT_PARENT
   drop constraint FK_PARENT_IN_CONCEPT;

alter table ENTRY_TAG
   drop constraint FK_TAG_IN_CONCEPT;

alter table ENTRY_TAG
   drop constraint FK_CONCEPT_IN_TAG;

alter table EQUATION
   drop constraint FK_ENTRY_IN_EQUATION;

alter table IDEA_CONCEPT
   drop constraint FK_IDEA_IN_CONCEPT;

alter table IDEA_CONCEPT
   drop constraint FK_CONCEPT_IN_IDEA;

alter table IMAGE
   drop constraint FK_ENTRY_IN_IMAGE;

alter table SOURCE
   drop constraint FK_ENTRY_IN_SOURCE;

drop index CONCEPT_PARENT_FK;

drop index PARENT_CONCEPT_FK;

drop table CONCEPT_PARENT cascade constraints;

drop table ENTRY cascade constraints;

drop index ENTRY_TAG_FK;

drop index ENTRY_TAG2_FK;

drop table ENTRY_TAG cascade constraints;

drop index ENTRY_EQUATION_FK;

drop table EQUATION cascade constraints;

drop index IDEA_CONCEPT_FK;

drop index CONCEPT_IDEA_FK;

drop table IDEA_CONCEPT cascade constraints;

drop index ENTRY_IMAGE_FK;

drop table IMAGE cascade constraints;

drop index ENTRY_SOURCE_FK;

drop table SOURCE cascade constraints;

drop table TAG cascade constraints;

/*==============================================================*/
/* Table: CONCEPT_PARENT                                        */
/*==============================================================*/
create table CONCEPT_PARENT 
(
   ID_PARENT            INTEGER              not null,
   ID_CONCEPT           INTEGER              not null,
   constraint PK_CONCEPT_PARENT primary key (ID_PARENT, ID_CONCEPT)
);

/*==============================================================*/
/* Index: PARENT_CONCEPT_FK                                     */
/*==============================================================*/
create index PARENT_CONCEPT_FK on CONCEPT_PARENT (
   ID_CONCEPT ASC
);

/*==============================================================*/
/* Index: CONCEPT_PARENT_FK                                     */
/*==============================================================*/
create index CONCEPT_PARENT_FK on CONCEPT_PARENT (
   ID_PARENT ASC
);

/*==============================================================*/
/* Table: ENTRY                                                 */
/*==============================================================*/
create table ENTRY 
(
   ID_ENTRY             INTEGER              not null,
   TITLE_ENTRY          VARCHAR2(100),
   TEXT_ENTRY           VARCHAR2(10000),
   TYPE_ENTRY           CHAR(1)              not null
      constraint CKC_TYPE_ENTRY_ENTRY check (TYPE_ENTRY in ('C','I', 'E')),
   constraint PK_ENTRY primary key (ID_ENTRY)
);

/*==============================================================*/
/* Table: ENTRY_TAG                                             */
/*==============================================================*/
create table ENTRY_TAG 
(
   ID_TAG               INTEGER              not null,
   ID_CONCEPT           INTEGER              not null,
   constraint PK_ENTRY_TAG primary key (ID_TAG, ID_CONCEPT)
);

/*==============================================================*/
/* Index: ENTRY_TAG2_FK                                         */
/*==============================================================*/
create index ENTRY_TAG2_FK on ENTRY_TAG (
   ID_CONCEPT ASC
);

/*==============================================================*/
/* Index: ENTRY_TAG_FK                                          */
/*==============================================================*/
create index ENTRY_TAG_FK on ENTRY_TAG (
   ID_TAG ASC
);

/*==============================================================*/
/* Table: EQUATION                                              */
/*==============================================================*/
create table EQUATION 
(
   ID_EQUATION          INTEGER              not null,
   ID_ENTRY             INTEGER              not null,
   CODE_EQUATION        VARCHAR2(500)        not null,
   TITLE_EQUATION       VARCHAR2(100),
   TEXT_EQUATION        VARCHAR2(1000),
   constraint PK_EQUATION primary key (ID_EQUATION)
);

/*==============================================================*/
/* Index: ENTRY_EQUATION_FK                                     */
/*==============================================================*/
create index ENTRY_EQUATION_FK on EQUATION (
   ID_ENTRY ASC
);


/*==============================================================*/
/* Table: IDEA_CONCEPT                                          */
/*==============================================================*/
create table IDEA_CONCEPT 
(
   ID_IDEA              INTEGER              not null,
   ID_CONCEPT           INTEGER              not null,
   constraint PK_IDEA_CONCEPT primary key (ID_IDEA, ID_CONCEPT)
);

/*==============================================================*/
/* Index: CONCEPT_IDEA_FK                                       */
/*==============================================================*/
create index CONCEPT_IDEA_FK on IDEA_CONCEPT (
   ID_CONCEPT ASC
);

/*==============================================================*/
/* Index: IDEA_CONCEPT_FK                                       */
/*==============================================================*/
create index IDEA_CONCEPT_FK on IDEA_CONCEPT (
   ID_IDEA ASC
);

/*==============================================================*/
/* Table: IMAGE                                                 */
/*==============================================================*/
create table IMAGE 
(
   ID_IMAGE             INTEGER              not null,
   ID_ENTRY             INTEGER              not null,
   FILE_IMAGE           BLOB                 not null,
   TITLE_IMAGE          VARCHAR2(100),
   TEXT_IMAGE           VARCHAR2(1000),
   constraint PK_IMAGE primary key (ID_IMAGE)
);

/*==============================================================*/
/* Index: ENTRY_IMAGE_FK                                        */
/*==============================================================*/
create index ENTRY_IMAGE_FK on IMAGE (
   ID_ENTRY ASC
);

/*==============================================================*/
/* Table: SOURCE                                                */
/*==============================================================*/
create table SOURCE 
(
   ID_SOURCE            INTEGER              not null,
   ID_ENTRY             INTEGER              not null,
   LINK_SOURCE          VARCHAR2(1000)       not null,
   TITLE_SOURCE         VARCHAR2(100),
   TEXT_SOURCE          VARCHAR2(1000),
   constraint PK_SOURCE primary key (ID_SOURCE)
);

/*==============================================================*/
/* Index: ENTRY_SOURCE_FK                                       */
/*==============================================================*/
create index ENTRY_SOURCE_FK on SOURCE (
   ID_ENTRY ASC
);

/*==============================================================*/
/* Table: TAG                                                   */
/*==============================================================*/
create table TAG 
(
   ID_TAG               INTEGER              not null,
   NAME_TAG             VARCHAR2(100)        not null,
   constraint PK_TAG primary key (ID_TAG)
);

alter table CONCEPT_PARENT
   add constraint FK_CONCEPT_IN_PARENT foreign key (ID_PARENT)
      references ENTRY (ID_ENTRY);

alter table CONCEPT_PARENT
   add constraint FK_PARENT_IN_CONCEPT foreign key (ID_CONCEPT)
      references ENTRY (ID_ENTRY);

alter table ENTRY_TAG
   add constraint FK_TAG_IN_CONCEPT foreign key (ID_TAG)
      references TAG (ID_TAG);

alter table ENTRY_TAG
   add constraint FK_CONCEPT_IN_TAG foreign key (ID_CONCEPT)
      references ENTRY (ID_ENTRY);

alter table EQUATION
   add constraint FK_ENTRY_IN_EQUATION foreign key (ID_ENTRY)
      references ENTRY (ID_ENTRY);

alter table IDEA_CONCEPT
   add constraint FK_IDEA_IN_CONCEPT foreign key (ID_CONCEPT)
      references ENTRY (ID_ENTRY);

alter table IDEA_CONCEPT
   add constraint FK_CONCEPT_IN_IDEA foreign key (ID_IDEA)
      references ENTRY (ID_ENTRY);

alter table IMAGE
   add constraint FK_ENTRY_IN_IMAGE foreign key (ID_ENTRY)
      references ENTRY (ID_ENTRY);

alter table SOURCE
   add constraint FK_ENTRY_IN_SOURCE foreign key (ID_ENTRY)
      references ENTRY (ID_ENTRY);


alter table ENTRY
   add constraint ENTRY_CHK_TABLE
      CHECK (
            (TYPE_ENTRY  = 'C'		
               AND TITLE_ENTRY IS NOT NULL) OR
            (TYPE_ENTRY  = 'I'		
               AND TEXT_ENTRY IS NOT NULL)
      );