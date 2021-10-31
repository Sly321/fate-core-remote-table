import * as wecco from "@weccoframework/core"
import { API, TableMessage } from "../api"
import { Gamemaster, Model, Player, PlayerCharacter, Rating, Table } from "../models"

export class UpdateTable {
    readonly command = "update-table"

    constructor (public readonly table: Table) {}
}

export class NewTable {
    readonly command = "new-table"

    constructor(public readonly title: string) { }
}

export class JoinTable {
    readonly command = "join-table"

    constructor(public readonly id: string, public readonly name: string) {}
}

export class UpdatePlayerFatePoints {
    readonly command = "update-fate-points"

    constructor (public readonly playerId: string, public readonly fatePoints: number) {}
}

export class SpendFatePoint {
    readonly command = "spend-fate-point"
}

export class AddAspect {
    readonly command = "add-aspect"

    constructor (public readonly name: string, public readonly targetPlayerId?: string) {}
}

export class RemoveAspect {
    readonly command = "remove-aspect"

    constructor (public readonly id: string) {}
}

export class RollDice {
    readonly command = "roll-dice"

    constructor(public readonly rating: Rating) { }
}

export type Message = UpdateTable | 
    NewTable | 
    JoinTable | 
    UpdatePlayerFatePoints | 
    SpendFatePoint | 
    AddAspect |
    RemoveAspect |
    RollDice

export class Controller {
    private api: API

    async update(model: Model, message: Message, context: wecco.AppContext<Message>): Promise<Model | typeof wecco.NoModelChange> {
        if (typeof this.api === "undefined") {
            this.api = await API.connect(context, model.userId)
        }

        switch (message.command) {
            case "update-table":
                if (message.table.gamemasterId === model.userId) {
                    return new Gamemaster(model.userId, message.table)
                }
            
                return new PlayerCharacter(model.userId, message.table)
            
            case "new-table":
                this.api.createTable(message.title)
                return wecco.NoModelChange

            case "join-table":
                this.api.joinTable(message.id, message.name)
                return wecco.NoModelChange

            case "update-fate-points":
                if (model instanceof Gamemaster) {
                    this.api.updateFatePoints(model.table.id, message.playerId, message.fatePoints)
                }
                return wecco.NoModelChange

            case "spend-fate-point":
                if (model instanceof PlayerCharacter) {
                    this.api.spendFatePoint(model.table.id)
                }
                return wecco.NoModelChange

            case "add-aspect":
                if (model instanceof Gamemaster) {
                    this.api.addAspect(model.table.id, message.name, message.targetPlayerId)
                }
                return wecco.NoModelChange

            case "remove-aspect":
                if (model instanceof Gamemaster) {
                    this.api.removeAspect(model.table.id, message.id)
                }
                return wecco.NoModelChange

            case "roll-dice":
                if ((model instanceof PlayerCharacter) || (model instanceof Gamemaster)) {
                    return model.roll(message.rating)
                }
        }

        return model
    }
}
