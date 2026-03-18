package com.accounting.api.category.model

import com.accounting.database.category.Category
import kotlinx.serialization.Serializable

@Serializable
data class PublicCategory(
    val id: String,
    val name: String,
    val editable: Boolean,
    val parent: String?,
) {

    companion object {

        /**
         * Converts [Category] to [PublicCategory].
         */
        fun from(category: Category) = PublicCategory(
            id = category.id,
            name = category.name,
            editable = category.editable,
            parent = category.parent,
        )
    }
}
