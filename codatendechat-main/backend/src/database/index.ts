// src/database/index.ts

import "../bootstrap"                // se você tiver inicializações gerais
import { config } from "dotenv"
config()                            // carrega .env, incluindo DATABASE_URL

import { Sequelize } from "sequelize-typescript"
import databaseConfig from "../config/database"  // suas outras opções (pool, logging, define, retry, etc.)

// todos os seus modelos
import Company from "../models/Company"
import User from "../models/User"
import Contact from "../models/Contact"
import Ticket from "../models/Ticket"
import Message from "../models/Message"
import Whatsapp from "../models/Whatsapp"
import ContactCustomField from "../models/ContactCustomField"
import Setting from "../models/Setting"
import Queue from "../models/Queue"
import WhatsappQueue from "../models/WhatsappQueue"
import UserQueue from "../models/UserQueue"
import Plan from "../models/Plan"
import TicketNote from "../models/TicketNote"
import QuickMessage from "../models/QuickMessage"
import Help from "../models/Help"
import TicketTraking from "../models/TicketTraking"
import UserRating from "../models/UserRating"
import QueueOption from "../models/QueueOption"
import Schedule from "../models/Schedule"
import Tag from "../models/Tag"
import TicketTag from "../models/TicketTag"
import ContactList from "../models/ContactList"
import ContactListItem from "../models/ContactListItem"
import Campaign from "../models/Campaign"
import CampaignSetting from "../models/CampaignSetting"
import Baileys from "../models/Baileys"
import CampaignShipping from "../models/CampaignShipping"
import Announcement from "../models/Announcement"
import Chat from "../models/Chat"
import ChatUser from "../models/ChatUser"
import ChatMessage from "../models/ChatMessage"
import Invoices from "../models/Invoices"
import Subscriptions from "../models/Subscriptions"
import BaileysChats from "../models/BaileysChats"
import Files from "../models/Files"
import FilesOptions from "../models/FilesOptions"
import Prompt from "../models/Prompt"
import QueueIntegrations from "../models/QueueIntegrations"
import { FlowDefaultModel } from "../models/FlowDefault"
import { FlowBuilderModel } from "../models/FlowBuilder"
import { FlowAudioModel } from "../models/FlowAudio"
import { FlowCampaignModel } from "../models/FlowCampaign"
import { FlowImgModel } from "../models/FlowImg"

const MODELS = [
  Company,
  User,
  Contact,
  Ticket,
  Message,
  Whatsapp,
  ContactCustomField,
  Setting,
  Queue,
  WhatsappQueue,
  UserQueue,
  Plan,
  TicketNote,
  QuickMessage,
  Help,
  TicketTraking,
  UserRating,
  QueueOption,
  Schedule,
  Tag,
  TicketTag,
  ContactList,
  ContactListItem,
  Campaign,
  CampaignSetting,
  Baileys,
  CampaignShipping,
  Announcement,
  Chat,
  ChatUser,
  ChatMessage,
  Invoices,
  Subscriptions,
  BaileysChats,
  Files,
  FilesOptions,
  Prompt,
  QueueIntegrations,
  FlowDefaultModel,
  FlowBuilderModel,
  FlowAudioModel,
  FlowCampaignModel,
  FlowImgModel,
]

// se tiver conexão por URL, use este construtor:
const sequelize = new Sequelize(dbConfig.url!, {
  dialect: dbConfig.dialect,
  define:      dbConfig.define,
  timezone:    dbConfig.timezone,
  logging:     dbConfig.logging,
  pool:        dbConfig.pool,
  retry:       dbConfig.retry,
  models: [ Company, User /* … */ ]
});

export default sequelize;