export const testxslt = '\
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">\
    <xsl:output method="html"/>\
    <xsl:template match="/">\
        <div>\
            <xsl:for-each select="breakfast_menu/food">\
                <div style="background-color:teal;color:white;padding:4px">\
                    <xsl:element name="span">\
                        <xsl:attribute name="contenteditable">true</xsl:attribute>\
                        <xsl:attribute name="data-path">/breakfast_menu/food/name[<xsl:number/>]</xsl:attribute>\
                        <xsl:value-of select="name"/>\
                    </xsl:element>\
                    -\
                    <xsl:element name="span">\
                        <xsl:attribute name="contenteditable">true</xsl:attribute>\
                        <xsl:attribute name="data-path">/breakfast_menu/food/price[<xsl:number/>]</xsl:attribute>\
                        <xsl:value-of select="price"/>\
                    </xsl:element>\
                </div>\
                <div style="margin-left:20px;margin-bottom:1em;font-size:10pt">\
                    <p>\
                        <xsl:element name="span">\
                            <xsl:attribute name="contenteditable">true</xsl:attribute>\
                            <xsl:attribute name="data-path">/breakfast_menu/food/description[<xsl:number/>]</xsl:attribute>\
                            <xsl:value-of select="description"/>\
                        </xsl:element>\
                    </p>\
                </div>\
            </xsl:for-each>\
        </div>\
    </xsl:template>\
</xsl:stylesheet>'
