"use server";

import { z } from "zod";
import { actionClient } from "../../safe-action";
import * as chambreService from "../chambre.service";

export const getChambreByIdAction = actionClient
    .inputSchema(z.object({ id: z.string().uuid() }))
    .action(async ({ parsedInput }) => {
        const chambre = await chambreService.getById(parsedInput.id);
        return { data: chambre };
    });
