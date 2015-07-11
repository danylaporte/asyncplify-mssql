USE [asyncplify-mssql]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Table1](
	[Id] [int] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Table_1] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
INSERT [dbo].[Table1] ([Id], [Name]) VALUES (1, N'Record 1')
GO
INSERT [dbo].[Table1] ([Id], [Name]) VALUES (2, N'Record 2')
GO
INSERT [dbo].[Table1] ([Id], [Name]) VALUES (3, N'Record 3')
GO
INSERT [dbo].[Table1] ([Id], [Name]) VALUES (4, N'Record 4')
GO
