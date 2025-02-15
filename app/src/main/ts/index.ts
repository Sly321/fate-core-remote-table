import * as wecco from "@weccoframework/core"
import "../css/index.css"
import { Controller, JoinTable, ReplaceScene } from "./control"
import { Aspect, Gamemaster, Home, Model, Player, PlayerCharacter, Table } from "./models"
import { load, m } from "./utils/i18n"
import { root } from "./views"


document.addEventListener("DOMContentLoaded", async () => {
    await load()

    const controller = new Controller()

    const context = wecco.app(() => new Model(new Home()), controller.update.bind(controller), root, "#app")
    
    if (document.location.pathname.startsWith("/join/")) {
        const tableId = document.location.pathname.replace("/join/", "")
        const name = prompt(m("home.joinTable.promptName"))
        if (name !== null) {
            document.location.hash = ""
            context.emit(new JoinTable(tableId, name.trim()))
        }

    } else if (document.location.hash.startsWith("#dev/gamemaster")) {
        context.emit(new ReplaceScene(new Gamemaster("1", new Table(
                "1", 
                "Test Table", 
                "1",
                [
                    new Player("2", "Cynere", 2, [
                        new Aspect("5", "Cover"),
                    ]),
                    new Player("3", "Landon", 4, []),
                    new Player("4", "Zird", 0, []),
                ],
                [
                    new Aspect(
                        "1",
                        "Fog",
                    ),
                    new Aspect(
                        "2",
                        "Slippy Grounds",
                    ),
                ]
            ))))
    } else if (document.location.hash.startsWith("#dev/player")) {
        context.emit(new ReplaceScene(new PlayerCharacter("2", new Table(
                "1", 
                "Test Table", 
                "1",
                [
                    new Player("2", "Cynere", 2, [
                        new Aspect("5", "Cover"),
                    ]),
                    new Player("3", "Landon", 4, []),
                    new Player("4", "Zird", 1, []),
                ],
                [
                    new Aspect(
                        "1",
                        "Fog",
                    ),
                    new Aspect(
                        "2",
                        "Slippy Grounds",
                    ),
                ]
            ))))
    }
})

