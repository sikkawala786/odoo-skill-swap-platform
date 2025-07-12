{
    'name': 'Skill Swap Platform',
    'version': '1.0',
    'category': 'Social',
    'summary': 'Platform to offer and request skills',
    'description': 'Allows users to list offered/wanted skills and manage swaps.',
    'author': 'Tasnim Sikkawala',
    'depends': ['base'],
    'data': [
        'security/ir.model.access.csv',
        'views/skill_profile_views.xml',
        'views/menus.xml',
    ],
    'installable': True,
    'application': True,
}
