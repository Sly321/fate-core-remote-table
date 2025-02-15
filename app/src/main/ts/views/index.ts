import * as wecco from "@weccoframework/core"
import { Message } from "../control"
import { Gamemaster, Home, Model, PlayerCharacter } from "../models"
import { showNotifications } from "./components/notification"
import { gamemaster } from "./scenes/gamemaster"
import { home } from "./scenes/home"
import { player } from "./scenes/player"

export function root (model: Model, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    showNotifications(model.notifications)
    
    if (model.scene instanceof Home) {
        return home(model.scene, context)
    }

    if (model.scene instanceof PlayerCharacter) {
        return player(model.scene, context)
    }

    if (model.scene instanceof Gamemaster) {
        return gamemaster(model.scene, context)
    }    

    return "Unknown model"
}
